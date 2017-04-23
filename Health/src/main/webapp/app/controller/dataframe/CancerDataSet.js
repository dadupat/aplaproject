/**
 * 
 */
class CancerDataSet extends DataSet{

    constructor () {
    	super();
    }
    
	getColumnList() {

		var DataFrame = dfjs.DataFrame;
			DataFrame.fromCSV('./DownloadableContent/CancerRate.csv').then(
                df => {
                    var columns = df.listColumns();
                    return columns ;
                }
            ).catch(err => {
                console.log(err);
            });
	}

	getDistinctColumnVal() {
		var DataFrame = dfjs.DataFrame;
		DataFrame.fromCSV('./DownloadableContent/CancerRate.csv').then(
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
	}

	getTableData(){
		var DataFrame = dfjs.DataFrame;
		DataFrame.fromCSV('./DownloadableContent/CancerRate.csv').then(
            df => {
                var data = df.toArray();
                return data;
            }
        ).catch(err => {
            console.log(err);
        });
	}

	getQueryData(cancerType, gender, years){
		var DataFrame = dfjs.DataFrame;
        DataFrame.fromCSV('./DownloadableContent/CancerRate.csv').then(
             df => {

                 DataFrame.sql.registerTable(df, 'cancerTable');
                 var query = 'SELECT * FROM cancerTable WHERE CancerType=' + cancerType;


                 if (gender != null && gender.length == 1){
                     query = query + " AND Gender=" + gender[0];
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
                 return dataRows();
	        }
        ).catch(err => {
            console.log(err);
        });
    }
}