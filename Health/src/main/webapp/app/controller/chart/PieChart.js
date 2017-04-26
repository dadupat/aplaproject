class PieChart extends ChartObserver {

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
        console.log("after returning from builddata stateDataMap size="+stateDataMap.size);
      
        //getting stateLabelsArray
        var stateLabelsArray=new Array();
        stateLabelsArray=buildChartData.generateStateLabelsArray();

        // this.generateDatasetWithColor(stateDataMap,stateLabelsArray);
        var datasetObjArray=buildChartData.generatePieDatasetWithColor(stateDataMap,stateLabelsArray);
        this._datasetJsonArray=  datasetObjArray;*/

           var ctx = document.getElementById("pieChart");
        var lineChart1 = new Chart(ctx, {
            type: this._type,
            data: {
              labels: this._labelsArray,
              datasets: this._datasetJsonArray
            },
            
        });
    }
}