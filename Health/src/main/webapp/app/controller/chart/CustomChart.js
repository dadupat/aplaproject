class CustomChart {

selectChart(){
    createChart("lineChkBox", "lineChartDiv", createLineChart);
    createChart("barChkBox", "barChartDiv", createBarChart);
    createChart("pieChkBox", "pieChartDiv", createPieChart);
    createChart("doughnutChkBox", "doughnutChartDiv", createDoughnutChart);
    createChart("stackedChkBox", "stackedChartDiv", createStackedChart);
}

createChart(checkBoxName, chartDivName, viewChart){
    if(document.getElementById(checkBoxName).checked){
        viewChart();
        document.getElementById(chartDivName).style.display = 'block';
    }else{
        document.getElementById(chartDivName).style.display = 'none';
    }
}

}