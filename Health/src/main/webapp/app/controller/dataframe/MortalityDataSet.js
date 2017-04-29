/**
 * MortalityDataSet class defines the method/behaviour for mortality/Death rate dataset.
 */
class MortalityDataSet extends DataSet{

    constructor () {
    	super();
        this.filename = './DownloadableContent/DeathRate.csv';
    }
    
    // getColumnList returns column names.
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
	
     //getDistinctColumnVal returns distinct column values from csv files.
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

    // getTableData returns the data from csv files.
	getTableData(){
		var DataFrame = dfjs.DataFrame;
		var tableData = DataFrame.fromCSV(this.filename).then(
            df => {
                var data = df.toArray();
				data[data.length] = df.listColumns();
                for(var i=0;i<data.length;i++){
                  data[i][2]=(data[i][2]).toString().replace(/[$]/g,' ');
                  data[i][3]=(data[i][3]).toString().replace(/[$]/g,' ');
                }
                return data;
            }
        ).catch(err => {
            console.log(err);
        });
        return tableData;
	}

    // getQueryData creates the query to prepare dataRow from selected Column/Row  and return the resultset.
	getQueryData(death_Cause,gender,years){
		var DataFrame = dfjs.DataFrame;
        return DataFrame.fromCSV(this.filename).then(
             df => {
                 DataFrame.sql.registerTable(df, 'DeathRateTable', true);
                 if(death_Cause==''){
                    death_Cause="Diseases$of$heart";
                    alert("Default Death Cause value selected = Diseases of heart (* You can select desired death cause)");
                 }
                 var query = "SELECT * FROM DeathRateTable WHERE Death$Cause=" + "'" + death_Cause + "'";
                 if (gender != null && gender.length == 1){
                     query = query + " AND Gender=" + gender[0];
                 }
                else if(gender != null && gender.length > 1){
                    var multipleGender='(';
                    for(var p=0;p<gender.length;p++){
                        if(p==0){
                        multipleGender=multipleGender+ gender[0];
                        }
                        else{
                            multipleGender=multipleGender+','+gender[p];
                        }
                    }
                    multipleGender=multipleGender+')';
                    query = query + " AND Gender IN "+multipleGender ;
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
                }
                else{
                    years = df.distinct('Year').toArray();
                }
                //console.log(query);
                var dataRows = DataFrame.sql.request(query).toArray();
                //console.log(dataRows);
                
                if(dataRows[0] != null){
                 this.calculateAndApplyAggFunction(dataRows);
                }
                var genderDataMap =new Map();
                for (i=0;i<dataRows.length;i++) {
                    if(genderDataMap.has(dataRows[i][1])){
                        var existingGendarDataArray=genderDataMap.get(dataRows[i][1]);
                        existingGendarDataArray.push(dataRows[i][3]);
                        genderDataMap.set(dataRows[i][1],existingGendarDataArray);
                    }
                    else{
                        var genderDataArray= new Array();
                        genderDataArray.push(dataRows[i][3]);
                        genderDataMap.set(dataRows[i][1],genderDataArray);  
                    }
                } 
                var genderLabelsArray= new Array();
                for (var [key, value] of genderDataMap) {
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

    // getDistinctColumnVal returns distinct datavalue for a column name.
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

    // displayColumns creates column level selection checkboxes dynamically.  
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

    // onchangeHandler perform action on Column checkbox selection dynamically. Show and hide row level selection with distinct data values.
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
               if(selectBox.id != "idselectDeath$Cause"){
                   selectBox.multiple=true;
               }

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

    // getMultiSelectData creates array of filtered data and return those to getQueryData method.
     getMultiSelectData(){
        var gender = document.getElementById('idselectGender');
        var year = document.getElementById('idselectYear');
        var deathcause = document.getElementById('idselectDeath$Cause');
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
        return this.getQueryData(valuesDeath, valuesGender, valuesYear);
    }

    // createAggregateElements creates 'Minimum','Maximum','Average','Count','Standard Deviation' checkboxes dynamically on UI.
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

    // calculateAndApplyAggFunction calculates the Minimum','Maximum','Average','Count','Standard Deviation' and apply the changes to UI.
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
                if (parseFloat(dataRows[i][3]) > parseFloat(max)){
                    max = parseFloat(dataRows[i][3]);
                    maxValue = dataRows[i];
                }      
            }
            divResult.appendChild(document.createTextNode('Record with Maximum Value : '+maxValue.toString().replace(/[$]/g,' ')));
            var linebreak = document.createElement("br");
            divResult.appendChild(linebreak);
        }

        if(this.selectedArray.includes('Minimum')){
            var min =dataRows[0][3];
            var minValue =dataRows[0];
            for (var i=1 ; i < dataRows.length ; i++) {
                if (parseFloat(dataRows[i][3]) < parseFloat(min)){
                    min = parseFloat(dataRows[i][3]);
                    minValue = dataRows[i];
                }
                    
            }
            divResult.appendChild(document.createTextNode('Record with Minimum Value : '+minValue.toString().replace(/[$]/g,' ')));
            var linebreak = document.createElement("br");
            divResult.appendChild(linebreak);
        }

        var avgValue=0;
        for (var i=0 ; i < dataRows.length ; i++) {
            avgValue= parseFloat(avgValue)+parseFloat(dataRows[i][3]);
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
                diffavg = Math.pow((parseFloat(dataRows[i][3])-avg),2);
                total += diffavg;
            } 
            var temp23= parseFloat(total)/parseFloat(dataRows.length);
            var stdDeviation = Math.sqrt(temp23);
            divResult.appendChild(document.createTextNode('Standard deviation for records : '+stdDeviation));
            var linebreak = document.createElement("br");
            divResult.appendChild(linebreak);    
        } 
    }

}