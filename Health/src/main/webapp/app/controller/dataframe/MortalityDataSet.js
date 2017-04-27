/**
 * 
 */
class MortalityDataSet extends DataSet{

    constructor () {
    	super();
        this.filename = './DownloadableContent/DeathRate.csv';
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
                  data[i][2]=(data[i][2]).toString().replace(/[$]/g,' ');
                }
                return data;
            }
        ).catch(err => {
            console.log(err);
        });
        return tableData;
	}

	getQueryData(death_Cause,gender,years){
		var DataFrame = dfjs.DataFrame;
        return DataFrame.fromCSV(this.filename).then(
             df => {

                 DataFrame.sql.registerTable(df, 'DeathRateTable', true);
                 var query = "SELECT * FROM DeathRateTable WHERE Death_Cause=" + "'" + death_Cause + "'";


                 if (gender != null && gender.length == 1){
                     query = query + " AND Gender=" + gender[0];
                 }
                  else if(gender != null && gender.length > 1){
                     var multipleGender='(';
                     for(var p=0;p<gender.length;p++)
                     {
                         if(p==0)
                         {
                            multipleGender=multipleGender+ gender[0];
                         }
                         else
                         {
                             multipleGender=multipleGender+','+gender[p];
                         }
                     }
                     multipleGender=multipleGender+')';
                     console.log("Gender IN query prepared multipleGender="+multipleGender);
                     query = query + " WHERE Gender IN "+multipleGender ;
                 }

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
                     query = query + " AND Year IN " + yearStr;
                 }else{
                     years = df.distinct('Year').toArray();
                 }
                 console.log(query);
                 var dataRows = DataFrame.sql.request(query).toArray();
                 console.log(dataRows.length);

                     	   

                 var genderDataMap =new Map();
                

                 for (i=0;i<dataRows.length;i++) {
                   
                     if(genderDataMap.has(dataRows[i][1]))
                     {
                         console.log("element present=");
                         var existingGendarDataArray=genderDataMap.get(dataRows[i][1]);
                         existingGendarDataArray.push(dataRows[i][3]);
                         genderDataMap.set(dataRows[i][1],existingGendarDataArray);
                     }
                     else
                     {
                         console.log("adding element in map for first time="+dataRows[i][1]);
                         var genderDataArray= new Array();
                         genderDataArray.push(dataRows[i][3]);
                         genderDataMap.set(dataRows[i][1],genderDataArray);  
                     }
                 } 

                var genderLabelsArray= new Array();
                for (var [key, value] of genderDataMap) {
                            console.log(key + ' = ' + value);
                            genderLabelsArray.push(key);   
                }

                var datasetObjArray=new Array();
            for(var x=0;x<genderLabelsArray.length;x++){
                var genderLabel=genderLabelsArray[x];
                var genderDataArray=genderDataMap.get(genderLabel);

                var datasetObj= new DatasetObj(genderLabel,genderDataArray,null,null,null);
                datasetObjArray.push(datasetObj);
            }

            DataFrame.sql.dropTable('DeathRateTable');
            
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
               if(selectBox.id != "idselectDeath_Cause"){
                   selectBox.multiple=true;
               }
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
        var gender = document.getElementById('idselectGender');
        var year = document.getElementById('idselectYear');
        var deathcause = document.getElementById('idselectDeath_Cause');
        var valuesGender = [];
        var valuesYear = [];
        var valuesDeath = [];

        if(null != gender){
            for (var i = 0; i < gender.options.length; i++) {
                if (gender.options[i].selected) {
                    valuesGender.push(gender.options[i].value);
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

        if(null != deathcause){
            for (var i = 0; i < deathcause.options.length; i++) {
                if (deathcause.options[i].selected) {
                    valuesDeath.push(deathcause.options[i].value);
                }
            }
        }

        console.log(valuesDeath, valuesGender, valuesYear);
        var div = document.getElementById('aggregateFunction');
        var labelCol = document.createElement('label');
        labelCol.htmlFor="labelCol";
        labelCol.appendChild(document.createTextNode('Select Aggregate Function:  '));
        div.appendChild(labelCol);
        var aggFunct = ['Minimum','Maximum','Average','Count','Standard Deviation'];
        for(var i=0;i<aggFunct.length;i++){
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = aggFunct[i];
            checkbox.value = aggFunct[i];
            checkbox.id = aggFunct[i];
            div.appendChild(checkbox);
            var label = document.createElement('label');
            label.appendChild(document.createTextNode(aggFunct[i]));
            div.appendChild(label);
        }
        // it should return an array and use that value to change UI here
        return this.getQueryData(valuesDeath, valuesGender, valuesYear);
    }

    createAggregateElements(){
        var div = document.getElementById('aggregateFunction');
        var labelCol = document.createElement('label');
        labelCol.htmlFor="labelCol";
        labelCol.appendChild(document.createTextNode('Select Aggregate Function:  '));
        div.appendChild(labelCol);
        var aggFunct = ['Minimum','Maximum','Average','Count','Standard_Deviation'];
        for(var i=0;i<=aggFunct.length;i++){
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = aggFunct[i];
            checkbox.value = aggFunct[i];
            checkbox.id = aggFunct[i];
            //checkbox.onchange = (function(opt) {
                                          //   return function() {
                                           //     instance.aggregationChangeHandler(opt, instance);
                                           //  };
                                        // })(columnNames[i], instance);
            div.appendChild(checkbox);
            div.appendChild('   ');
            label.appendChild(document.createTextNode(aggFunct[i]));
            div.appendChild(label);
        }
    }
/*
    aggregationChangeHandler(aggChk, instance){
        instance.aggChk = aggChk;
        var chkbox =document.getElementById(instance.aggChkcb);
        if (chkbox.checked) {
            //this.aggChk.
        } else {
            //
        }
    }*/
}