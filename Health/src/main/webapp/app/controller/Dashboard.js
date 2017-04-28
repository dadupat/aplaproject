'use strict'
class DashBoard {

    createTable(dataType){
        var instance = this;
    
        var dataSetFactory = new DataSetFactory();
        var dataSet = dataSetFactory.getDataSet(dataType);
        instance.cleanUpComponentOnDataSetChange();
        dataSet.getTableData().then(function(tableData){
            if(tableData != undefined){
                instance.displayTable(tableData);
            }
        });
        dataSet.displayColumns();
        document.getElementById('generateChartButton').style.display = 'block';
        this.datasetContext = dataType;
        var dataSetHeader = document.getElementById('dataSetHeader');
        dataSetHeader.innerHTML ='';
        var labelCl = document.createElement('label');
        labelCl.appendChild(document.createTextNode((this.datasetContext + ' Data Set').toUpperCase()));
        dataSetHeader.appendChild(labelCl);
    }

    displayTable(tableData){
        var table = document.createElement('table');
        var tableBody = document.createElement('tbody');
        table.className = "table";
        var tableHeader = table.createTHead();
        var rowHead = tableHeader.insertRow(0);

        for(var i=0; i<tableData[0].length; i++){
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
        dataComponentDiv.innerHTML = '';
        dataComponentDiv.appendChild(newDiv);
        dataComponentDiv.scrollTop=0;
    }

    generateCharts(){
        var instance = this;
        var dataSetFactory = new DataSetFactory();
        var aggregateFunctionResult = document.getElementById('aggregateFunctionResult');
        aggregateFunctionResult.innerHTML = '';
        var dataSet = dataSetFactory.getDataSet(this.datasetContext);
        var queryResultPromise = dataSet.getMultiSelectData();
        queryResultPromise.then(function(queryData){
            if(queryData != undefined){
                document.getElementById('checkboxesId').style.display = 'block';
                instance.createChart(queryData);
            }
        });
    }

generateCommonBuildChartData(labelsArray,datasetsArray){

    var buildChartData=new BuildChartData(labelsArray,datasetsArray);
        
        //getting stateDataMap
        var stateDataMap =new Map();
        stateDataMap=buildChartData.generateStateDataMap();
      
        //getting stateLabelsArray
        var stateLabelsArray=new Array();
        stateLabelsArray=buildChartData.generateStateLabelsArray();
       
       //for bar chart
        var barDatasetObjArray=buildChartData.generateBarDatasetWithColor(stateDataMap,stateLabelsArray);
        var barChart= new BarChart('bar',stateLabelsArray,barDatasetObjArray);
		 	barChart.generateChart();

       //for line chart
       var lineDatasetObjArray=buildChartData.generateLineDatasetWithColor(stateDataMap,stateLabelsArray);
        var lineChart= new LineChart('line',labelsArray,lineDatasetObjArray);
		lineChart.generateChart();

        //for stacked line chart
        var stackedLineDatasetObjArray=buildChartData.generateLineDatasetWithColor(stateDataMap,stateLabelsArray);
        var stackedChart= new StackedChart('line',labelsArray,stackedLineDatasetObjArray);
		stackedChart.generateChart();
        
        //for pie chart
        var pieDatasetObjArray=buildChartData.generatePieDatasetWithColor(stateDataMap,stateLabelsArray);
        var pieChart= new PieChart('pie',labelsArray,pieDatasetObjArray);
		pieChart.generateChart();  

        //for doughnut chart
        var dounutDatasetObjArray=buildChartData.generatePieDatasetWithColor(stateDataMap,stateLabelsArray);
        var donughnutChart= new DoughnutChart('doughnut',labelsArray,dounutDatasetObjArray);
		donughnutChart.generateChart();

}

    createChart(queryData){
       
        var labelsArray=queryData[0];
        var datasetsArray=queryData[1];

       //generating BuildChartData only once for each call
       this.generateCommonBuildChartData(labelsArray,datasetsArray);

   
    }

    showHideGraph(chkBoxId, chartDivId){
         if(document.getElementById(chkBoxId).checked == true){
             document.getElementById(chartDivId).style.display = 'block';
         }else{
             document.getElementById(chartDivId).style.display = 'none';
         }
    }

    cleanUpComponentOnDataSetChange(){
        var aggregateFunction = document.getElementById('aggregateFunction');
        var aggregateFunctionResult = document.getElementById('aggregateFunctionResult');
        var columnCheckbox = document.getElementById('columnCheckbox');
        var multiselectdropdown = document.getElementById('multiselectdropdown');
        var checkboxesId = document.getElementById('checkboxesId');

        var graphDivFirst = document.getElementById('lineChart');
        var graphDivSec = document.getElementById('barChart');
        var graphDivthrd = document.getElementById('pieChart');
        var graphDivfourth = document.getElementById('doughnutChart');
        var graphDivfifth = document.getElementById('stackedChart');
        
        var ctxGraphDivFirst=graphDivFirst.getContext("2d");
        var ctxGraphDivSec=graphDivSec.getContext("2d");
        var ctxGraphDivthrd=graphDivthrd.getContext("2d");
        var ctxGraphDivfourth=graphDivfourth.getContext("2d");
        var ctxGraphDivfifth=graphDivfifth.getContext("2d");

        multiselectdropdown.innerHTML = '';
        columnCheckbox.innerHTML = '';
        aggregateFunction.innerHTML = '';
        aggregateFunctionResult.innerHTML = '';
        checkboxesId.innerHTML='';
        ctxGraphDivFirst.clearRect(0, 0, graphDivFirst.width, graphDivFirst.height);
        ctxGraphDivSec.clearRect(0, 0, graphDivSec.width, graphDivSec.height);
        ctxGraphDivthrd.clearRect(0, 0, graphDivthrd.width, graphDivthrd.height);
        ctxGraphDivfourth.clearRect(0, 0, graphDivfourth.width, graphDivfourth.height);
        ctxGraphDivfifth.clearRect(0, 0, graphDivfifth.width, graphDivfifth.height);

    }
}

var dashboard = new DashBoard();