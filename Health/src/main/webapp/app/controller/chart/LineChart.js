class LineChart extends ChartObserver {

    constructor (type,labelsArray, datasetJsonArray) {
        super();
        this._type = type;
        this._labelsArray=labelsArray;
        this._datasetJsonArray=datasetJsonArray;
    }




    generateChart(){
      
    /* var buildChartData=new BuildChartData(this._labelsArray,this._datasetJsonArray);
        
        //getting stateDataMap
        var stateDataMap =new Map();
        stateDataMap=buildChartData.generateStateDataMap();
      
        //getting stateLabelsArray
        var stateLabelsArray=new Array();
        stateLabelsArray=buildChartData.generateStateLabelsArray();
       

        var datasetObjArray=buildChartData.generateLineDatasetWithColor(stateDataMap,stateLabelsArray);
        this._datasetJsonArray=  datasetObjArray;*/

           var ctx = document.getElementById("lineChart");
        var lineChart1 = new Chart(ctx, {
            type: this._type,
            data: {
              labels: this._labelsArray,
              datasets: this._datasetJsonArray
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
    }
}