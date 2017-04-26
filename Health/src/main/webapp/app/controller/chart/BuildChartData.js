
class BuildChartData{

  

    constructor (labelsArray, datasetJsonArray) {
     
        this._labelsArray = labelsArray;
        this._datasetJsonArray = datasetJsonArray;
      
    }


    generateStateLabelsArray(){

    console.log("inside generateStateLabelsArray");
    var labelsArray=new Array();
    labelsArray=this._labelsArray;
 

    var datasetJsonArray= new Array();
    datasetJsonArray=this._datasetJsonArray;
   

    var stateLabelsArray= new Array();
    
    for(var i=0;i<datasetJsonArray.length;i++)
        {
        var datasetObj= new DatasetObj(null,null,null,null,null);
        datasetObj=datasetJsonArray[i];
        var label=datasetObj.label;
        stateLabelsArray.push(label);
      
         }
         return stateLabelsArray;
    }

     generateStateDataMap(){

    console.log("inside generateStateDataMap");
    var labelsArray=new Array();
    labelsArray=this._labelsArray;
  

    var datasetJsonArray= new Array();
    datasetJsonArray=this._datasetJsonArray;
 

   
    var stateDataMap =new Map();
    var stateDataArray=new Array();

    for(var i=0;i<datasetJsonArray.length;i++)
        {
        var datasetObj= new DatasetObj(null,null,null,null,null);
        datasetObj=datasetJsonArray[i];
        var label=datasetObj.label;
        
        
        stateDataArray=datasetObj.data;
        stateDataMap.set(label,stateDataArray);
         }
         return stateDataMap;
    }



generateLineDatasetWithColor(stateDataMap,stateLabelsArray)
{
  
    //preparing color maps
     var stateLabelsArray1=new Array();
     stateLabelsArray1=stateLabelsArray;

  
        if(this.linesLabelsBorderColorMap==null ){

            this.linesLabelsBorderColorMap=new Map();
            for(var j=0;j<stateLabelsArray1.length;j++)
            {
             
             this.linesLabelsBorderColorMap.set(stateLabelsArray1[j],this.getRandomColor())
             }
        }
     
     
   

      var datasetObjArray=new Array();
      datasetObjArray= this.datasetGenerationForLineChart(stateLabelsArray1,stateDataMap,this.linesLabelsBorderColorMap,datasetObjArray);
     this._datasetJsonArray=  datasetObjArray;    

     return datasetObjArray;
}
datasetGenerationForLineChart(stateLabelsArray,stateDataMap,linesLabelsBorderColorMap,datasetObjArray)
    {
         for(var p=0;p<stateLabelsArray.length;p++){
                    console.log("state="+stateLabelsArray[p]);
                    console.log("Datapoints="+stateDataMap.get(p));
                    //console.log("label color="+labelsBackgroundColorMap.get(p));
                    console.log("border color="+linesLabelsBorderColorMap.get(p));
                    var stateLabel=stateLabelsArray[p];
                    var fill="false";
                    var datasetObj= new DatasetObj(stateLabel,stateDataMap.get(stateLabel),null,linesLabelsBorderColorMap.get(stateLabel),3,fill);
                    datasetObjArray.push(datasetObj);
                }
                return datasetObjArray;
    }


generateBarDatasetWithColor(stateDataMap,stateLabelsArray)
{
  
   
     var stateLabelsArray1=new Array();
     stateLabelsArray1=stateLabelsArray;
     
    
      if(this.linesLabelsBackgroundColorMap==null){

            this.linesLabelsBackgroundColorMap=new Map();
            for(var j=0;j<stateLabelsArray1.length;j++)
            {
            
             this.linesLabelsBackgroundColorMap.set(stateLabelsArray1[j],this.getRandomColor());
             }
        }

      if(this.linesLabelsBorderColorMap==null){

            this.linesLabelsBorderColorMap=new Map();
           for (var [key, value] of this.linesLabelsBackgroundColorMap) {
                            console.log(key + ' = ' + value);
                            this.linesLabelsBorderColorMap.set(key,value);
                }
        }

      var datasetObjArray=new Array();
      datasetObjArray= this.datasetGenerationForBarChart(stateLabelsArray1,stateDataMap,this.linesLabelsBorderColorMap, this.linesLabelsBorderColorMap,datasetObjArray);
     this._datasetJsonArray=  datasetObjArray;    

     return datasetObjArray;
}

datasetGenerationForBarChart(stateLabelsArray,stateDataMap,labelsBackgroundColorMap,labelsBorderColorMap,datasetObjArray)
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
    }

        
generatePieDatasetWithColor(stateDataMap,stateLabelsArray)
{
  
   
     var stateLabelsArray1=new Array();
     stateLabelsArray1=stateLabelsArray;

     var yearLabelsArray=new Array();
     yearLabelsArray=this._labelsArray;
  
       if(this.labelsBackgroundColorArray==null){
       this.labelsBackgroundColorArray=new Array();
       for(var j=0;j<yearLabelsArray.length;j++)
            {
                   this.labelsBackgroundColorArray.push(this.getRandomColor());
            }

         }
        if(this.labelsBorderColorArray==null){

            this.labelsBorderColorArray=new Array();
            for(var j=0;j<yearLabelsArray.length;j++)
            {
         
             this.labelsBorderColorArray.push('#000000');
             }
        }

    
     console.log("piechart---labelsBackgroundColorArray size="+this.labelsBackgroundColorArray.length);
     console.log("piechart---labelsBorderColorArray size="+this.labelsBorderColorArray.length);
     this.global_var="piechart_global_value";

      var datasetObjArray=new Array();
      datasetObjArray= this.datasetGenerationForPieChart(stateLabelsArray1,stateDataMap,this.labelsBackgroundColorArray,this.labelsBorderColorArray,datasetObjArray);
     
     return datasetObjArray;  

     


}


datasetGenerationForPieChart(stateLabelsArray,stateDataMap,labelsBackgroundColorArray,labelsBorderColorArray,datasetObjArray)
    {
        console.log("Printing global value="+this.global_var);
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
    }

    

     getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
    }


}