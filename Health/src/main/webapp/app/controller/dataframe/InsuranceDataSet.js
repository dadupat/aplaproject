/**
 * MortalityDataSet class defines the method/behaviour for Medical Insurance dataset.
 */
class InsuranceDataSet extends DataSet{

    constructor () {
    	super();
        this.filename = './DownloadableContent/HealthInsurance.csv';
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
                  data[i][0]=(data[i][0]).toString().replace(/[$]/g,' ');
                }
                return data;
            }
        ).catch(err => {
            console.log(err);
        });
        return tableData;
	}
	
    // getQueryData creates the query to prepare dataRow from selected Column/Row  and return the resultset.
	getQueryData(state, years){
		var DataFrame = dfjs.DataFrame;
        return DataFrame.fromCSV(this.filename).then(
             df => {
                DataFrame.sql.registerTable(df, 'insuranceTable');
                var query = 'SELECT * FROM insuranceTable';
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
                }else{
                    state = df.distinct('State').toArray();
                    if(flag==false){
                        query = query + " AND State = 'Illinois'";
                        alert("Setting State by default to Illinois(* You can select multiple States");
                    }
                }

                //console.log(query);
                var dataRows = DataFrame.sql.request(query).toArray();
                // console.log(dataRows);
                if(dataRows[0] != null){
                    super.calculateAndApplyAggFunction(dataRows,false);
                }
                var stateDataMap =new Map();
                for (i=0;i<dataRows.length;i++) {
                    if(stateDataMap.has(dataRows[i][0])) { 
                        var existingStateDataArray=stateDataMap.get(dataRows[i][0]);
                        existingStateDataArray.push(dataRows[i][2]);
                        stateDataMap.set(dataRows[i][0],existingStateDataArray);
                    }
                    else{
                        var stateDataArray= new Array();
                        stateDataArray.push(dataRows[i][2]);
                        stateDataMap.set(dataRows[i][0],stateDataArray);  
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

        		DataFrame.sql.dropTable('insuranceTable');
                var result = new Array();
                result.push(years); 
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

    // getMultiSelectData creates array of filtered data and return those to getQueryData method.
    getMultiSelectData(){
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
        return this.getQueryData(valuesState, valuesYear);
    }
}