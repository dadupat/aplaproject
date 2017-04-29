/**
 * 
 */
class BirthDataSet extends DataSet{

    constructor () {
    	super();
        this.filename = './DownloadableContent/BirthRate.csv';
    }
    
	getColumnList() {
		var DataFrame = dfjs.DataFrame;
        return DataFrame.fromCSV(this.filename).then(
            df => {
                var columns = df.listColumns();
                return columns;
            }
        ).catch(err => {
            console.log(err);
        });
	}
	
	getDistinctColumnVal() {
		var DataFrame = dfjs.DataFrame;
		var distColumnValues = DataFrame.fromCSV(this.filename).then(
            df => {
                var columns = df.listColumns();
                var distColumnValues = [];
                for (var i=0; i<columns.length; i++){
                    distColumnValues[i] = df.distinct(columns[i]).toDict()[columns[i]];
                }
                return distColumnValues;
            }
        ).catch(err => {
            console.log(err);
        });
        return distColumnValues;
	}

	getTableData(){
		var DataFrame = dfjs.DataFrame;
		var tableData = DataFrame.fromCSV(this.filename).then(
            df => {
                var data = df.toArray();
				data[data.length] = df.listColumns();
                for(var i=0;i<data.length;i++){
                  data[i][1]=(data[i][1]).toString().replace(/[$]/g,' ');
                  data[i][2]=(data[i][2]).toString().replace(/[$]/g,' ');
                }
                return data;
            }
        ).catch(err => {
            console.log(err);
        });
        return tableData;
	}
	
	getQueryData(state,years){
		var DataFrame = dfjs.DataFrame;
        return DataFrame.fromCSV(this.filename).then(
             df => {
                 DataFrame.sql.registerTable(df, 'birthRateTable');
                 var query = 'SELECT * FROM birthRateTable';
                 var flag=false;
                 if (years != null && years.length != 0){
                     var yearStr = null;
                     for (var i=0; i<years.length ; i++){
                         if (yearStr != null){
                             yearStr = yearStr + ",";
                         }else{
                             yearStr = '(';
                         }
                         yearStr = yearStr + years[i];
                     }
                     yearStr = yearStr + ')';
                     query = query + " where Year IN " + yearStr;
                 }
                 else{
                     years = df.distinct('Year').toArray();
                     if (state != null && state.length != 0){
                        query = query + " WHERE ";
                     }
					 flag=true;
                 }
                if(flag==false && state != null && state.length != 0){
                    query=query+" AND ";
                }
                if (state != null && state.length != 0){
                    var stateStr = null;
                    for (var i=0; i<state.length ; i++){
                        if (stateStr != null){
                            stateStr = stateStr + ",";
                        }
                        else{
                            stateStr = '(';
                        }
                        stateStr = stateStr + state[i];
                    }
                    stateStr = stateStr + ')';
                    query = query + "State IN " + stateStr;
                }
                else{
                    state = df.distinct('State').toArray();
                    if(flag==false){
                        query = query + " AND State = 'Illinois'";
                    }
                    alert("Setting State by default to Illinois(* You can select multiple States)");
                 }
                 //console.log(query);
                 var dataRows = DataFrame.sql.request(query).toArray();
                 //console.log(dataRows);
                
                if(dataRows[0] != null){
                    this.calculateAndApplyAggFunction(dataRows);
                }	     

                var stateDataMap =new Map();
                for (i=0;i<dataRows.length;i++) {
                    if(stateDataMap.has(dataRows[i][1])){
                        var existingStateDataArray=stateDataMap.get(dataRows[i][1]);
                        existingStateDataArray.push(dataRows[i][2]);
                        stateDataMap.set(dataRows[i][1],existingStateDataArray);
                    }
                    else{
                        var stateDataArray= new Array();
                        stateDataArray.push(dataRows[i][2]);
                        stateDataMap.set(dataRows[i][1],stateDataArray);  
                    } 
                }
                var stateLabelsArray= new Array();
                for (var [key, value] of stateDataMap) {
                    stateLabelsArray.push(key);
                }
         
                var datasetObjArray=new Array();
                for(var x=0;x<stateLabelsArray.length;x++){
                    var stateLabel=stateLabelsArray[x];
                    var stateDataArray=stateDataMap.get(stateLabel);
                    var datasetObj= new DatasetObj(stateLabel,stateDataArray,null,null,null);
                    datasetObjArray.push(datasetObj);
                }
               
           		DataFrame.sql.dropTable('birthRateTable');
        		var result = new Array();
                result.push(years);
              	result.push (datasetObjArray);
                return result;  
	        }
        ).catch(err => {
            console.log(err);
        });
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

	getDistinctColumnVal(columnName) {
		var DataFrame = dfjs.DataFrame;
		return DataFrame.fromCSV(this.filename).then(
            df => {
                return df.distinct(columnName).toDict()[columnName];
            }
        ).catch(err => {
            console.log(err);
        });
	}

	displayColumns(){
        var instance = this;
        this.getColumnList().then(function(columnNames){
            if(columnNames != undefined){
                var div = document.getElementById('columnCheckbox');
                var labelCol = document.createElement('label');
                labelCol.htmlFor="labelCol";
                labelCol.appendChild(document.createTextNode('Select Column :'));
                div.appendChild(labelCol);

                for(var i=0;i<columnNames.length-1;i++){
                    var checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.name = columnNames[i];
                    checkbox.value = columnNames[i];
                    checkbox.id = columnNames[i];
                    checkbox.style.marginLeft="50px";
                    checkbox.onchange =  (function(opt) {
                                             return function() {
                                                instance.onchangeHandler(opt, instance);
                                             };
                                         })(columnNames[i], instance);
                    div.appendChild(checkbox);
                    var label = document.createElement('label');
                    label.htmlFor="id"+i;
                    label.appendChild(document.createTextNode(columnNames[i].toString().replace(/[$]/g,' ')));
                    div.appendChild(label);
                }
            }
        });
        this.createAggregateElements();
    }

    onchangeHandler(cb, instance){
        instance.cb = cb;
        this.getDistinctColumnVal(instance.cb).then(function(distinctArray){
            if(distinctArray != undefined){
               var chkbox=document.getElementById(instance.cb);
               var div = document.getElementById('multiselectdropdown');
               var selectBox = document.createElement('select');
               selectBox.name = instance.cb;
               selectBox.value = instance.cb;
               selectBox.style.marginRight="50px";
               selectBox.id = 'idselect'+instance.cb;
               selectBox.multiple=true;
               
               for (var i = 0; i<distinctArray.length; i++){
                   var opt = document.createElement('option');
                   opt.value = distinctArray[i];
                   opt.innerHTML = distinctArray[i].toString().replace(/[$]/g,' ');
                   selectBox.appendChild(opt);
               }

               if (chkbox.checked) {
                       var label = document.createElement('label');
                       label.id= 'idlabel'+instance.cb;
                       label.appendChild(document.createTextNode('Select '+instance.cb.toString().replace(/[$]/g,' ')+' : '));
                       div.appendChild(label);
                       div.appendChild(selectBox);
               } else {
                   var div111 = document.getElementById('idselect'+instance.cb);
                   var div222 = document.getElementById('idlabel'+instance.cb);
                   div.removeChild(div111);
                   div.removeChild(div222);
               }
            }
        });
    }

    getMultiSelectData(){
        //if possible call  getColumnList iterate on that list to get column names to store in idSelect.
        var state = document.getElementById('idselectState');
        var year = document.getElementById('idselectYear');
       
        var valuesState = [];
        var valuesYear = [];
        
        if(null != state){
            for (var i = 0; i < state.options.length; i++) {
                if (state.options[i].selected) {
                    valuesState.push(state.options[i].value);
                }
            }
        }

        if(null != year){
            for (var i = 0; i < year.options.length; i++) {
                if (year.options[i].selected) {
                    valuesYear.push(year.options[i].value);
                }
            }
        }
        // it should return an array and use that value to change UI here
        return this.getQueryData(valuesState, valuesYear);
    }

    createAggregateElements(){
        var inst = this;
        var divAgg = document.getElementById('aggregateFunction');
        var labelCol1 = document.createElement('label');
        labelCol1.htmlFor="labelCol1";
        labelCol1.appendChild(document.createTextNode('Select Aggregate Function:  '));
        divAgg.appendChild(labelCol1);
        
        var aggFunct = ['Minimum','Maximum','Average','Count','Standard Deviation'];
        for(var i=0;i<aggFunct.length;i++){
            var checkboxAgg = document.createElement('input');
            checkboxAgg.type = 'checkbox';
            checkboxAgg.name = aggFunct[i];
            checkboxAgg.value = aggFunct[i];
            checkboxAgg.id = aggFunct[i];
            checkboxAgg.style.marginLeft="50px";
            divAgg.appendChild(checkboxAgg);
            var labl = document.createElement('label');
            labl.appendChild(document.createTextNode(aggFunct[i]));
            divAgg.appendChild(labl);
        }  
    }

    calculateAndApplyAggFunction(dataRows){

        this.selectedArray = new Array(); 
        var aggFunct = ['Minimum','Maximum','Average','Count','Standard Deviation'];
        var divResult = document.getElementById('aggregateFunctionResult');
        aggregateFunctionResult.innerHTML = '';
        for(var i=0;i<aggFunct.length;i++){
            var aggElement = document.getElementById(aggFunct[i]);
            if(aggElement!=null && aggElement.checked ==  true){
                this.selectedArray.push(aggFunct[i]);
            }
         }

        if(this.selectedArray[0]!=null){
            var labelCl = document.createElement('label');
            labelCl.appendChild(document.createTextNode('Aggregate Function Result: '));
            var linebreak = document.createElement("br");
            divResult.appendChild(labelCl);
            divResult.appendChild(linebreak);
        }
        
        if(this.selectedArray.includes('Maximum')){
            var max =0;
            var maxValue =0;
            for (var i=0 ; i < dataRows.length ; i++) {
                if (parseFloat(dataRows[i][2]) > parseFloat(max)){
                    max = parseFloat(dataRows[i][2]);
                    maxValue = dataRows[i];
                }      
            }
            divResult.appendChild(document.createTextNode('Record with Maximum Value : '+maxValue.toString().replace(/[$]/g,' ')));
            var linebreak = document.createElement("br");
            divResult.appendChild(linebreak);
        }

        if(this.selectedArray.includes('Minimum')){
            var min =dataRows[0][2];
            var minValue =dataRows[0];
            for (var i=1 ; i < dataRows.length ; i++) {
                if (parseFloat(dataRows[i][2]) < parseFloat(min)){
                    min = parseFloat(dataRows[i][2]);
                    minValue = dataRows[i];
                }
                    
            }
            divResult.appendChild(document.createTextNode('Record with Minimum Value : '+minValue.toString().replace(/[$]/g,' ')));
            var linebreak = document.createElement("br");
            divResult.appendChild(linebreak);
        }

        var avgValue=0;
        for (var i=0 ; i < dataRows.length ; i++) {
            avgValue= parseFloat(avgValue)+parseFloat(dataRows[i][2]);
        }
        var avg= parseFloat(avgValue)/parseFloat(dataRows.length);

        if(this.selectedArray.includes('Average')){
            divResult.appendChild(document.createTextNode('Record with Average Value : '+avg));
            var linebreak = document.createElement("br");
            divResult.appendChild(linebreak);
        }

        if(this.selectedArray.includes('Count')){
            divResult.appendChild(document.createTextNode('Records Count : '+dataRows.length));
            var linebreak = document.createElement("br");
            divResult.appendChild(linebreak);
        }

        if(this.selectedArray.includes('Standard Deviation')){
            var total= 0;
            var diffavg=0;
            for(var i = 0; i < dataRows.length; i++) {
                diffavg = Math.pow((parseFloat(dataRows[i][2])-avg),2);
                total += diffavg;
            } 
            var temp23= parseFloat(total)/parseFloat(dataRows.length);
            var stdDeviation = Math.sqrt(temp23);
            divResult.appendChild(document.createTextNode('Standard deviation for records : '+stdDeviation));
            var linebreak = document.createElement("br");
            divResult.appendChild(linebreak);    
        } 
    }

    datasetGenerationForBarChart(stateLabelsArray,stateDataMap,labelsBackgroundColorMap,labelsBorderColorMap,datasetObjArray){
        for(var p=0;p<stateLabelsArray.length;p++){    
            var stateLabel=stateLabelsArray[p];
            var datasetObj= new DatasetObj(stateLabel,stateDataMap.get(stateLabel),labelsBackgroundColorMap.get(stateLabel),labelsBorderColorMap.get(stateLabel),1);
            datasetObjArray.push(datasetObj);
        }
        return datasetObjArray;
    }

    datasetGenerationForPieChart(stateLabelsArray,stateDataMap,stateDataColorMap,stateDataBorderColorMap,borderWidth,datasetObjArray){
        var state= stateLabelsArray[0];
        var datasetObj= new DatasetObj(state,stateDataMap.get(state),stateDataColorMap.get(state),stateDataBorderColorMap.get(state),1);
        datasetObjArray.push(datasetObj);

        state= stateLabelsArray[1];
        datasetObj= new DatasetObj(state,stateDataMap.get(state),stateDataColorMap.get(state),stateDataBorderColorMap.get(state),1);
        datasetObjArray.push(datasetObj);
        return datasetObjArray;
    }
}