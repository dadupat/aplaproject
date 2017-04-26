class BarChart extends ChartObserver {

    constructor (type,labelsArray, datasetJsonArray) {
        super();
        this._type = type;
        this._labelsArray=labelsArray;
        this._datasetJsonArray=datasetJsonArray;
     

    }


/*generateDatasetWithColor(stateDataMap,stateLabelsArray)
{
  
    //preparing color maps
     var stateLabelsArray1=new Array();
     stateLabelsArray1=stateLabelsArray;
     
      var labelsBackgroundColorMap=new Map();
      var labelsBorderColorMap=new Map();
     for(var j=0;j<stateLabelsArray1.length;j++)
     {
            labelsBackgroundColorMap.set(stateLabelsArray1[j],this.getRandomColor());
            labelsBorderColorMap.set(stateLabelsArray1[j],this.getRandomColor())
     }

      var datasetObjArray=new Array();
      datasetObjArray= this.datasetGenerationForBarChart(stateLabelsArray1,stateDataMap,labelsBackgroundColorMap,labelsBorderColorMap,datasetObjArray);
     this._datasetJsonArray=  datasetObjArray;    

}*/

/*datasetGenerationForBarChart(stateLabelsArray,stateDataMap,labelsBackgroundColorMap,labelsBorderColorMap,datasetObjArray)
    {
         for(var p=0;p<stateLabelsArray.length;p++){
                    console.log("state="+stateLabelsArray[p]);
                    console.log("Datapoints="+stateDataMap.get(p));
                    console.log("label color="+labelsBackgroundColorMap.get(p));
                    console.log("border color="+labelsBorderColorMap.get(p));
                    var stateLabel=stateLabelsArray[p];
                    var datasetObj= new DatasetObj(stateLabel,stateDataMap.get(stateLabel),labelsBackgroundColorMap.get(stateLabel),labelsBorderColorMap.get(stateLabel),1);
                    datasetObjArray.push(datasetObj);
                }
                return datasetObjArray;
    }*/


    /* getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
    }*/


    generateChart(){
        
      /*  var buildChartData=new BuildChartData(this._labelsArray,this._datasetJsonArray);
        
        //getting stateDataMap
        var stateDataMap =new Map();
        stateDataMap=buildChartData.generateStateDataMap();
      
        //getting stateLabelsArray
        var stateLabelsArray=new Array();
        stateLabelsArray=buildChartData.generateStateLabelsArray();
       

        var datasetObjArray=buildChartData.generateBarDatasetWithColor(stateDataMap,stateLabelsArray);
        this._datasetJsonArray=  datasetObjArray;*/

        var ctx = document.getElementById("barChart");
        var lineChart1 = new Chart(ctx, {
            type: this._type,
            data: {
              labels: this._labelsArray,
            
                 datasets:this._datasetJsonArray
               
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