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
                 }else{
                     years = df.distinct('Year').toArray();
                 }
                 if (state != null && state.length != 0){
                     var stateStr = null;
                     for (var i=0; i<state.length ; i++){
                         if (stateStr != null){
                             stateStr = stateStr + ",";
                         }else{
                             stateStr = '(';
                         }
                         stateStr = stateStr + state[i];
                     }
                     stateStr = stateStr + ')';
                     query = query + " AND State IN " + stateStr;
                 }else{
                     state = df.distinct('State').toArray();
                 }

                 console.log(query);
                 var dataRows = DataFrame.sql.request(query).toArray();
                 console.log(dataRows.length);
                 console.log(dataRows);
                
               // var maleDatalabel = 'Male';
        	    // var femaleDatalabel = 'Female';
        	    
        	     

                var stateDataMap =new Map();
                

                 for (i=0;i<dataRows.length;i++) {
                   
                     if(stateDataMap.has(dataRows[i][1]))
                     {
                         console.log("element present=");
                         var existingStateDataArray=stateDataMap.get(dataRows[i][1]);
                         existingStateDataArray.push(dataRows[i][2]);
                         stateDataMap.set(dataRows[i][1],existingStateDataArray);
                     }
                     else
                     {
                         console.log("adding element in map for first time="+dataRows[i][1]);
                         var stateDataArray= new Array();
                         stateDataArray.push(dataRows[i][2]);
                         stateDataMap.set(dataRows[i][1],stateDataArray);  
                     }
                     
                     
                    }
                   
                    var stateLabelsArray= new Array();
                    var dataLabelsColor= new Array();
                     var stateDataColorMap =new Map();
                     var stateDataBorderColorMap =new Map();
                     var labelsBackgroundColorMap=new Map();
                     var labelsBorderColorMap=new Map();
                     
                    console.log("Printing stateDataMap");
                    console.log("-------------------------");
                    for (var [key, value] of stateDataMap) {
                            console.log(key + ' = ' + value);
                            stateLabelsArray.push(key);
                            var colorArray= new Array();
                            for(var i=0;i<value.length;i++)
                            {
                                colorArray.push(this.getRandomColor());
                            }
                            stateDataColorMap.set(key,colorArray);
                            stateDataBorderColorMap.set(key,colorArray);
                        }
                        console.log("-------------------------");
                        
                    console.log("The state labels="+stateLabelsArray);
                    for(var j=0;j<stateLabelsArray.length;j++)
                    {
                        labelsBackgroundColorMap.set(stateLabelsArray[j],this.getRandomColor());
                        labelsBorderColorMap.set(stateLabelsArray[j],this.getRandomColor())
                    }

                    console.log("printing all colors for labels");
                    console.log("-------------------------");
                    for (var [key, value] of stateDataColorMap) {
                        console.log(key + ' = ' + value);
                    }
                    console.log("-------------------------");
                    


        	var datasetObjArray=new Array();
            for(var x=0;x<stateLabelsArray.length;x++){
                var stateLabel=stateLabelsArray[x];
                var stateDataArray=stateDataMap.get(stateLabel);

                var datasetObj= new DatasetObj(stateLabel,stateDataArray,null,null,null);
                datasetObjArray.push(datasetObj);
            }
               
             //For Barchart
        	  /*var datasetObjArray=new Array();
              datasetObjArray= this.datasetGenerationForBarChart(stateLabelsArray,stateDataMap,labelsBackgroundColorMap,labelsBorderColorMap,datasetObjArray);
              */

                //For pie chart
              /* var datasetObjArray=new Array();
               datasetObjArray=this.datasetGenerationForPieChart(stateLabelsArray,stateDataMap,stateDataColorMap,stateDataBorderColorMap,1,datasetObjArray);
              */ 


               //Below is reference code dont delete
               /* var state= stateLabelsArray[0];
                var datasetObj= new DatasetObj(state,stateDataMap.get(state),stateDataColorMap.get(state),stateDataBorderColorMap.get(state),1);
                datasetObjArray.push(datasetObj);*/
                         
               /* datasetObj= new DatasetObj(stateLabelsArray[1],stateDataMap.get('Alaska'),labelsBackgroundColorMap.get('Alaska'),labelsBorderColorMap.get('Alaska'),1);
        		datasetObjArray.push(datasetObj);
                datasetObj= new DatasetObj(stateLabelsArray[2],stateDataMap.get('Arizona'),labelsBackgroundColorMap.get('Arizona'),labelsBorderColorMap.get('Arizona'),1);
                datasetObjArray.push(datasetObj);*/
              
        		DataFrame.sql.dropTable('birthRateTable');
        		
        		var result = new Array();
        		//for Barchart result.push (years);
                result.push(years);
               // result.push(datasetObj);  
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
                labelCol.appendChild(document.createTextNode('Select Column'));
                div.appendChild(labelCol);

                for(var i=0;i<columnNames.length-1;i++){
                    var checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.name = columnNames[i];
                    checkbox.value = columnNames[i];
                    checkbox.id = columnNames[i];
                    checkbox.onchange =  (function(opt) {
                                             return function() {
                                                instance.onchangeHandler(opt, instance);
                                             };
                                         })(columnNames[i], instance);
                    div.appendChild(checkbox);
                    var label = document.createElement('label');
                    label.htmlFor="id"+i;
                    label.appendChild(document.createTextNode(columnNames[i]));
                    div.appendChild(label);
                }
            }
        });
    }


    datasetGenerationForBarChart(stateLabelsArray,stateDataMap,labelsBackgroundColorMap,labelsBorderColorMap,datasetObjArray)
    {
         for(var p=0;p<stateLabelsArray.length;p++){
                    console.log("state="+stateLabelsArray[p]);
                    console.log("Datapoints="+stateDataMap.get(p));
                    console.log("label color="+labelsBackgroundColorMap.get(p));
                    console.log("border color="+labelsBorderColorMap.get(p));
                    var stateLabel=stateLabelsArray[p];
                    var datasetObj= new DatasetObj(stateLabel,stateDataMap.get(stateLabel),labelsBackgroundColorMap.get(stateLabel),labelsBorderColorMap.get(stateLabel),1);
                    datasetObjArray.push(datasetObj);
                }
                return datasetObjArray;
    }

    datasetGenerationForPieChart(stateLabelsArray,stateDataMap,stateDataColorMap,stateDataBorderColorMap,borderWidth,datasetObjArray)
    {
     var state= stateLabelsArray[0];
     var datasetObj= new DatasetObj(state,stateDataMap.get(state),stateDataColorMap.get(state),stateDataBorderColorMap.get(state),1);
     datasetObjArray.push(datasetObj);

     state= stateLabelsArray[1];
      datasetObj= new DatasetObj(state,stateDataMap.get(state),stateDataColorMap.get(state),stateDataBorderColorMap.get(state),1);
     datasetObjArray.push(datasetObj);
    

     return datasetObjArray;
    }
    onchangeHandler(cb, instance){
        instance.cb = cb;
        this.getDistinctColumnVal(instance.cb).then(function(distinctArray){
            if(distinctArray != undefined){
               var chkbox=document.getElementById(instance.cb);
               var div = document.getElementById('multiselectdropdown');
               var selectBox = document.createElement('select');
               //selectBox.type = 'select';
               selectBox.name = instance.cb;
               selectBox.value = instance.cb;
               selectBox.id = 'idselect'+instance.cb;
               selectBox.multiple=true;
               
               console.log(distinctArray);
               for (var i = 0; i<distinctArray.length; i++){
                   var opt = document.createElement('option');
                   opt.value = distinctArray[i];
                   opt.innerHTML = distinctArray[i].toString().replace(/[$]/g,' ');
                   selectBox.appendChild(opt);
               }

               if (chkbox.checked) {
                       div.appendChild(selectBox);
                       var label = document.createElement('label');
                       label.htmlFor='idlabel'+instance.cb;
                       label.id= 'idlabel'+instance.cb;
                       label.appendChild(document.createTextNode(instance.cb));
                       div.appendChild(label);
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
}