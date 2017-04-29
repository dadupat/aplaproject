/**
 * CancerDataSet class defines the method/behaviour for Cancer deaths dataset.
 */
class CancerDataSet extends DataSet{
	
    constructor () {
    	super();
    	this.filename = './DownloadableContent/CancerRate.csv';
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
	getQueryData(cancerType, gender, years){
		var DataFrame = dfjs.DataFrame;
        return DataFrame.fromCSV(this.filename).then(
             df => {
                DataFrame.sql.registerTable(df, 'cancerTable', true);
                if(cancerType==''){
                    cancerType="All";
                    alert("Default Cancer Type value selected = All (*You can select Cancer Type)");
                }
                if(cancerType!=null){
                    var query = "SELECT * FROM cancerTable WHERE Cancer$Type=" + "'" + cancerType + "'";
                }
                if (gender != null && gender.length == 1){
                    query = query + " AND Gender=" + gender[0];
                }
                else if(gender != null && gender.length > 1){
                    var multipleGender='(';
                    for(var p=0;p<gender.length;p++)
                    {
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
                }else{
                    years = df.distinct('Year').toArray();
                }
                //console.log(query);
                var dataRows = DataFrame.sql.request(query).toArray();
                // console.log(dataRows.length);

                if(dataRows[0] != null){
                    super.calculateAndApplyAggFunction(dataRows,true);
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

        		DataFrame.sql.dropTable('cancerTable');
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

    // getMultiSelectData creates array of filtered data  and return those to getQueryData method.
    getMultiSelectData(){
        var gender = document.getElementById('idselectGender');
        var year = document.getElementById('idselectYear');
        var cancerType = document.getElementById('idselectCancer$Type');
        var valuesGender = [];
        var valuesYear = [];
        var valuesCancer = [];

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

        if(null != cancerType){
            for (var i = 0; i < cancerType.options.length; i++) {
                if (cancerType.options[i].selected) {
                    valuesCancer.push(cancerType.options[i].value);
                }
            }
        }
        return this.getQueryData(valuesCancer, valuesGender, valuesYear);
    }
}