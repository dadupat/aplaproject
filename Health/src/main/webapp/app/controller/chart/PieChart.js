class PieChart extends ChartObserver {

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

     var yearLabelsArray=new Array();
     yearLabelsArray=this._labelsArray;
     //console.log("yearLabelsArray labels in pie chart="+yearLabelsArray);
     
      var labelsBackgroundColorArray=new Array();
      var labelsBorderColorArray=new Array();
     for(var j=0;j<yearLabelsArray.length;j++)
     {
            //labelsBackgroundColorMap.set(yearLabelsArray[j],this.getRandomColor());
            //labelsBorderColorMap.set(yearLabelsArray[j],this.getRandomColor())

            labelsBackgroundColorArray.push(this.getRandomColor());
            labelsBorderColorArray.push(this.getRandomColor());
            
     }
     //console.log("labelsBackgroundColorMap size="+labelsBackgroundColorMap.size);
     //console.log("labelsBorderColorMap size="+labelsBorderColorMap.size);

      var datasetObjArray=new Array();
      datasetObjArray= this.datasetGenerationForPieChart(stateLabelsArray1,stateDataMap,labelsBackgroundColorArray,labelsBorderColorArray,datasetObjArray);
     this._datasetJsonArray=  datasetObjArray;    

}*/

/*datasetGenerationForPieChart(stateLabelsArray,stateDataMap,labelsBackgroundColorArray,labelsBorderColorArray,datasetObjArray)
    {
         for(var p=0;p<stateLabelsArray.length;p++){
                    var stateLabel=stateLabelsArray[p];
                    console.log("state="+stateLabelsArray[p]);
                    console.log("Datapoints="+stateDataMap.get(stateLabel));
                    console.log("label color="+labelsBackgroundColorArray);
                    console.log("border color="+labelsBorderColorArray);
                    var datasetObj= new DatasetObj(stateLabel,stateDataMap.get(stateLabel),labelsBackgroundColorArray,labelsBorderColorArray,2);
                    datasetObjArray.push(datasetObj);
                }
                return datasetObjArray;
    }*/

/*
     getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}*/


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