'use strict'
class DashBoard {
    createTable(dataType){
        var instance = this;
        var dataSetFactory = new DataSetFactory();
        var dataSet = dataSetFactory.getDataSet(dataType);
        dataSet.getTableData().then(function(tableData){
            if(tableData != undefined){
                instance.displayTable(tableData);
            }
        });
        dataSet.displayColumns();
        document.getElementById('generateChartButton').style.display = 'block';
    }

    displayTable(tableData){
        var table = document.createElement('table');
        var tableBody = document.createElement('tbody');
        table.className = "table";
        var tableHeader = table.createTHead();
        var rowHead = tableHeader.insertRow(0);

        for(var i=0; i<tableData[0].length; i++){
        	console.log(tableData[tableData.length-1][i]);
        	var column = rowHead.insertCell(i)
        	column.innerHTML = "<h3>" + tableData[tableData.length-1][i] + "</h3>"
        }

        var newDiv = document.createElement('div');
        newDiv.style.height = "100px!important";
        var row = document.createElement('tr');
        for(var i=0; i<tableData.length-1; i++){
            var row = document.createElement('tr');
            for(var j=0; j<tableData[i].length; j++){
                 var column = document.createElement('td');
                 column.textContent = tableData[i][j];
                 row.appendChild(column);
            }
            tableBody.appendChild(row);
        }
        table.appendChild(tableBody);
        newDiv.appendChild(table);
        var dataComponentDiv = document.getElementById('toAppend');
        var columnCheckbox = document.getElementById('columnCheckbox');
        var multiselectdropdown = document.getElementById('multiselectdropdown');
        dataComponentDiv.innerHTML = '';
        columnCheckbox.innerHTML = '';
        multiselectdropdown.innerHTML = '';
        dataComponentDiv.appendChild(newDiv);
    }

    generateCharts(){
        var instance = this;
        var dataSetFactory = new DataSetFactory();
        var dataSet = dataSetFactory.getDataSet('birth');
        var queryResultPromise = dataSet.getMultiSelectData();
        queryResultPromise.then(function(queryData){
            if(queryData != undefined){
                document.getElementById('checkboxesId').style.display = 'block';
                instance.createChart(queryData);
            }
        });
    }

    createChart(queryData){
        // it will have all query data result which we can pass to new LineChart(any()) to generate different graphs.
        /*var lineChart = new LineChart('line', queryData)
        lineChart.generateChart();*/
        var labelsArray=queryData[0];
        var datasetsArray=queryData[1];

        var barChart= new BarChart('bar',labelsArray,datasetsArray);
		 	barChart.generateChart();
        //same for all chart type.

         var lineChart= new LineChart('line',labelsArray,datasetsArray);
		 	lineChart.generateChart();


         var donughnutChart= new DoughnutChart('doughnut',labelsArray,datasetsArray);
		 	donughnutChart.generateChart();

        var stackedChart= new StackedChart('line',labelsArray,datasetsArray);
		 	stackedChart.generateChart();

        var pieChart= new PieChart('pie',labelsArray,datasetsArray);
		 	pieChart.generateChart();   
    }

    showHideGraph(chkBoxId, chartDivId){
         if(document.getElementById(chkBoxId).checked == true){
             document.getElementById(chartDivId).style.display = 'block';
         }else{
             document.getElementById(chartDivId).style.display = 'none';
         }
    }
}

var dashboard = new DashBoard();