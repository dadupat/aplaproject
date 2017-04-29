class PieChart extends ChartObserver {

   constructor (type,labelsArray, datasetJsonArray) {
        super();
        this._type = type;
        this._labelsArray=labelsArray;
        this._datasetJsonArray=datasetJsonArray;
    }

    


     generateChart(){
      
       

           var ctx = document.getElementById("pieChart");
        var pieChart = new Chart(ctx, {
            type: this._type,
            data: {
              labels: this._labelsArray,
              datasets: this._datasetJsonArray
            },
            
        });
        return pieChart;
    }
}