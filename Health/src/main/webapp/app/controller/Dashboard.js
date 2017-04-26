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
        this.datasetContext = dataType;
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
        var aggregateFunction = document.getElementById('aggregateFunction');
        var aggregateFunctionResult = document.getElementById('aggregateFunctionResult');
        dataComponentDiv.innerHTML = '';
        columnCheckbox.innerHTML = '';
        multiselectdropdown.innerHTML = '';
        aggregateFunction.innerHTML = '';
        aggregateFunctionResult.innerHTML = '';
        dataComponentDiv.appendChild(newDiv);
    }

    generateCharts(){
        var instance = this;
        var dataSetFactory = new DataSetFactory();
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
        // it will have all query data result which we can pass to new LineChart(any()) to generate different graphs.
        /*var lineChart = new LineChart('line', queryData)
        lineChart.generateChart();*/
        var labelsArray=queryData[0];
        var datasetsArray=queryData[1];

       //generating BuildChartData only once for each call
       this.generateCommonBuildChartData(labelsArray,datasetsArray);

       /* var barChart= new BarChart('bar',labelsArray,datasetsArray);
		 	barChart.generateChart();
        

         var lineChart= new LineChart('line',labelsArray,datasetsArray);
		 	lineChart.generateChart();


         var donughnutChart= new DoughnutChart('doughnut',labelsArray,datasetsArray);
		 	donughnutChart.generateChart();

        var stackedChart= new StackedChart('line',labelsArray,datasetsArray);
		 	stackedChart.generateChart();

        var pieChart= new PieChart('pie',labelsArray,datasetsArray);
		 	pieChart.generateChart();  */ 
    }

    showHideGraph(chkBoxId, chartDivId){
         if(document.getElementById(chkBoxId).checked == true){
             document.getElementById(chartDivId).style.display = 'block';
         }else{
             document.getElementById(chartDivId).style.display = 'none';
         }
    }

    aggregateFun(agregChk){

    }
}

var dashboard = new DashBoard();