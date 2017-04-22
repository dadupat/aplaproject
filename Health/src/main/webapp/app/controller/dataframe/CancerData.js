/**
 * 
 */

function getCancerData(){
 	var years = [];
 	var gender = ['female', 'male'];
 	//getCancerQuery('All', gender, years);
 	getColumnName();
 	getCancerTable();
 }

/*function getCancerData(){
	getColumnData();
	getColumnDistinctValues();
	getCancerTable();
}*/

function getColumnName(){
	var DataFrame = dfjs.DataFrame;
	  DataFrame.fromCSV('./DownloadableContent/CancerRate.csv').then(
				 df => {
				     //data = df.toArray();
				     //console.log(typeof(data));
				     var columns = df.listColumns();
				     console.log('--------Column Names-------');
				     console.log (columns);
				     console.log('--------Column Distinct Values-------');
				     for (var i = 0; i<columns.length; i++ ){
				    	 console.log('--------------' + columns[i] + '------------');
				    	 var distinctArray = df.distinct(columns[i]).toDict()[columns[i]];
				    	 console.log (distinctArray);
				     }
				     df.distinct('column1')
				     
	                      /*for(var i=0; i<data.length; i++){
	                    	  console.log (data[i]);
	                          for(var j=0; j<data[i].length; j++){
	                             console.log(data[i][j]);
	                          }
	                      }*/
				 }
				).catch(err => {
				 console.log(err);
				});
}

function getCancerTable() {

	var DataFrame = dfjs.DataFrame;
	var data;
    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');
    table.className = "table";
    var tableHeader = table.createTHead();
    var rowHead = tableHeader.insertRow(0);
    var column1 = rowHead.insertCell(0);
    var column2 = rowHead.insertCell(1);
    var column3 = rowHead.insertCell(2);
    var column4 = rowHead.insertCell(3);
    column1.innerHTML = "<h3>Year</h3>";
    column2.innerHTML = "<h3>Gender</h3>";
    column3.innerHTML = "<h3>CancerType</h3>";
    column4.innerHTML = "<h3>CaseRate</h3>";
    var newDiv = document.createElement('div');
    newDiv.style.height = "100px!important";
    DataFrame.fromCSV('./DownloadableContent/CancerRate.csv').then(

			 df => {

			     data = df.toArray();
			     //console.log(typeof(data));
                      var row = document.createElement('tr');

                      for(var i=0; i<data.length; i++){
                          var row = document.createElement('tr');
                          for(var j=0; j<data[i].length; j++){
                             //console.log(data[i][j]);
                             var column = document.createElement('td');
                             column.textContent = data[i][j];
                             row.appendChild(column);
                          }
                         tableBody.appendChild(row);
                      }
                 table.appendChild(tableBody);
                 newDiv.appendChild(table);
                 document.getElementById('toAppend').appendChild(newDiv);
			 }
			).catch(err => {
			 console.log(err);
			});
}

function getCancerQuery(cancerType, gender, years) {
	//alert('getCancerQuery called');
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
	    
	     var maleData = new Data();
	     maleData.label = 'Male';
	     maleData.data = [];
	     var femaleData = new Data();
	     femaleData.label = 'Female';
	     femaleData.data = [];
	     
	     for (var i=0; i<dataRows.length; i++){
	    	 console.log(dataRows[i]);
	    	 if (dataRows[i][1] == 'male'){
	    		 maleData.data.push(dataRows[i][3]);
	    	 }else{
	    		 femaleData.data.push(dataRows[i][3]);
	    	 }
	     }
	     
	     console.log(maleData.data);
	     console.log(femaleData.data);
	     
/*	     var ctx = document.getElementById("barChart");
	     
	     
	     var lineChart1 = new Chart(ctx, {
	         type: 'barChart',
	         data: {
	           labels: years,
	           datasets: [{
	             label: maleData.label,
	             data: maleData.data
	           },{
		             label: femaleData.label,
		             data: femaleData.data
		           }
	           ]
	         }
	     });*/
	     
	     
	     var malecolor = []
	     var malebordercolor = []
	     var femalecolor = []
	     var femalebordercolor = []
	     
	     
	     for (var i=0; i<years.length; i++){
	    	 malecolor.push('rgba(255, 99, 132, 0.2)');
	    	 malebordercolor.push('rgba(255,99,132,1)');
	    	 femalecolor.push('rgba(54, 162, 235, 0.2)');
	    	 femalebordercolor.push('rgba(54, 162, 235, 1)');
	     }
	     
	     var ctx1 = document.getElementById("barChart");
	     var myChart = new Chart(ctx1, {
	         type: 'bar',
	         data: {
	             labels: years,
	             datasets: [{
	                 label: maleData.label,
	                 data: maleData.data,
	                 backgroundColor: malecolor,
	                 borderColor: malebordercolor,
	                 borderWidth: 1
	             }, {
	                 label: femaleData.label,
	                 data: femaleData.data,
	                 backgroundColor: femalecolor,
	                 borderColor: femalebordercolor,
	                 borderWidth: 1
	             }]
	         },
	         options: {
	             scales: {
	                 yAxes: [{
	                     ticks: {
	                         beginAtZero:true
	                     }
	                 }]
	             }
	         }
	     });
	     
	     
	     
	     

	     var ctx = document.getElementById("lineChart");
	     var lineChart1 = new Chart(ctx, {
	         type: 'line',
	         data: {
	             labels: years,
	             datasets: [{
	                 label: maleData.label,
	                 data: maleData.data,
	                 backgroundColor: malecolor,
	                 borderColor: malebordercolor,
	                 borderWidth: 1
	             }, {
	                 label: femaleData.label,
	                 data: femaleData.data,
	                 backgroundColor: femalecolor,
	                 borderColor: femalebordercolor,
	                 borderWidth: 1
	             }]
	         },
	     });
	     
	     
	     
	     
	     var ctx = document.getElementById("pieChart");
	     var myPieChart = new Chart(ctx,{
	         type: 'pie',
	         data: {
	             labels: years,
	             datasets: [{
	                 label: maleData.label,
	                 data: maleData.data,
	                 backgroundColor: malecolor,
	                 borderColor: malebordercolor,
	                 borderWidth: 1
	             }, {
	                 label: femaleData.label,
	                 data: femaleData.data,
	                 backgroundColor: femalecolor,
	                 borderColor: femalebordercolor,
	                 borderWidth: 1
	             }]
	         },
	     });
	     
	     
	     var ctx = document.getElementById("doughnutChart");

	     var myDoughnutChart = new Chart(ctx, {
	         type: 'doughnut',
	         data: {
	             labels: years,
	             datasets: [{
	                 label: maleData.label,
	                 data: maleData.data,
	                 backgroundColor: malecolor,
	                 borderColor: malebordercolor,
	                 borderWidth: 1
	             }, {
	                 label: femaleData.label,
	                 data: femaleData.data,
	                 backgroundColor: femalecolor,
	                 borderColor: femalebordercolor,
	                 borderWidth: 1
	             }]
	         },
	     });
	     
	     
	     
	     var ctx = document.getElementById("stackedChart");
	     var stackedLine = new Chart(ctx, {
	         type: 'line',
	         data: {
	             labels: years,
	             datasets: [{
	                 label: maleData.label,
	                 data: maleData.data,
	                 backgroundColor: malecolor,
	                 borderColor: malebordercolor,
	                 borderWidth: 1
	             }, {
	                 label: femaleData.label,
	                 data: femaleData.data,
	                 backgroundColor: femalecolor,
	                 borderColor: femalebordercolor,
	                 borderWidth: 1
	             }]
	         },
	         options: {
	             scales: {
	                 yAxes: [{
	                     stacked: true
	                 }]
	             }
	         }
	     });
	     
	     
	     
	 }
	).catch(err => {
	 console.log(err);
	});
}

