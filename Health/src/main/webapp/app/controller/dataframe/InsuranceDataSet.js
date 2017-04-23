/**
 * 
 */
class InsuranceDataSet extends DataSet{

    constructor () {
    	super();
    }
    
	getColumnList() {
		var DataFrame = dfjs.DataFrame;
        return DataFrame.fromCSV('./DownloadableContent/HealthInsurance.csv').then(
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
		var distColumnValues = DataFrame.fromCSV('./DownloadableContent/HealthInsurance.csv').then(
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
		var tableData = DataFrame.fromCSV('./DownloadableContent/HealthInsurance.csv').then(
            df => {
                var data = df.toArray();
                return data;
            }
        ).catch(err => {
            console.log(err);
        });
        return tableData;
	}
	
	getQueryData(){
	}
}