/**
 * 
 */
class SmokerDataSet extends DataSet{

    constructor () {
        super();
    }
    
	getColumnList() {
		var DataFrame = dfjs.DataFrame;
        return DataFrame.fromCSV('./DownloadableContent/SmokingData.csv').then(
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
		var distColumnValues = DataFrame.fromCSV('./DownloadableContent/SmokingData.csv').then(
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
		var tableData = DataFrame.fromCSV('./DownloadableContent/SmokingData.csv').then(
            df => {
                var data = df.toArray();
				data[data.length] = df.listColumns();
                return data;
            }
        ).catch(err => {
            console.log(err);
        });
        return tableData;
	}
	
	getQueryData(year,gender){
		var DataFrame = dfjs.DataFrame;
        return DataFrame.fromCSV(this.filename).then(
             df => {

                 DataFrame.sql.registerTable(df, 'smokingTable');
                 var query = 'SELECT * FROM smokingTable WHERE State=' + state;


                 console.log(query);
                 var dataRows = DataFrame.sql.request(query).toArray();
                 console.log(dataRows.length);

        		DataFrame.sql.dropTable('smokingTable');
        		
        		var result = new Array();
        		result.push (years);
        		result.push (datasetObjArray);
        		
                 return result;
                 
                 
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
               if(instance.cb != 'CancerType'){
                  selectBox.multiple=true;
               }
               console.log(distinctArray);
               for (var i = 0; i<distinctArray.length; i++){
                   var opt = document.createElement('option');
                   opt.value = distinctArray[i];
                   opt.innerHTML = distinctArray[i];
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

}