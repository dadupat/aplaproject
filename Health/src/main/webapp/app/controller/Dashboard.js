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
    }

    displayTable(tableData){
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
        var row = document.createElement('tr');
        for(var i=0; i<tableData.length; i++){
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
        document.getElementById('toAppend').appendChild(newDiv);
    }

    generateGraph(){
        var instance = this;
        var dataSetFactory = new DataSetFactory();
        var dataSet = dataSetFactory.getDataSet('cancer');
        var queryResultPromise = dataSet.getMultiSelectData();
        queryResultPromise.then(function(queryData){
            if(queryData != undefined){
                console.log("queryData: " + queryData);
                
                instance.createGraph(queryData);
                
            }
        });
    }

    createGraph(queryData){
        // it will have all query data result which we can pass to new LineChart(any()) to generate different graphs.
        /*var lineChart = new LineChart('line', queryData)
        lineChart.generateChart();*/
        
        var barChart= new BarChart('bar',queryData[0], queryData[1]);
		 	barChart.generateChart();
        //same for all chart type.
    }
}

var dashboard = new DashBoard();