/**
 * 
 */
class InsuranceDataSet extends DataSet{

    constructor () {
    	super();
        this.filename = './DownloadableContent/HealthInsurance.csv';
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
                  data[i][0]=(data[i][0]).toString().replace(/[$]/g,' ');
                }
                return data;
            }
        ).catch(err => {
            console.log(err);
        });
        return tableData;
	}
	
	getQueryData(state, years){
		var DataFrame = dfjs.DataFrame;
        return DataFrame.fromCSV(this.filename).then(
             df => {

                 DataFrame.sql.registerTable(df, 'insuranceTable');
                 var query = 'SELECT * FROM insuranceTable';

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
                

        	     
                 var stateDataMap =new Map();
                

                 for (i=0;i<dataRows.length;i++) {
                   
                     if(stateDataMap.has(dataRows[i][0]))
                     {
                         console.log("element present=");
                         var existingStateDataArray=stateDataMap.get(dataRows[i][0]);
                         existingStateDataArray.push(dataRows[i][2]);
                         stateDataMap.set(dataRows[i][0],existingStateDataArray);
                     }
                     else
                     {
                         console.log("adding element in map for first time="+dataRows[i][0]);
                         var stateDataArray= new Array();
                         stateDataArray.push(dataRows[i][2]);
                         stateDataMap.set(dataRows[i][0],stateDataArray);  
                     }
                     
                     
                    }
                 var stateLabelsArray= new Array();

                    for (var [key, value] of stateDataMap) {
                            //console.log(key + ' = ' + value);
                            stateLabelsArray.push(key);
                    
                        }

                var datasetObjArray=new Array();
            for(var x=0;x<stateLabelsArray.length;x++){
                var stateLabel=stateLabelsArray[x];
                var stateDataArray=stateDataMap.get(stateLabel);

                var datasetObj= new DatasetObj(stateLabel,stateDataArray,null,null,null);
                datasetObjArray.push(datasetObj);
                    }

        		DataFrame.sql.dropTable('insuranceTable');
        		

                //
                var result = new Array();
        		
                result.push(years); 
        		result.push (datasetObjArray);

                return result;
                //                
	        }
        ).catch(err => {
            console.log(err);
        });
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