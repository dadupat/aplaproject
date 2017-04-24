class BarChart extends ChartObserver {

    constructor (type,labelsArray, datasetJsonArray) {
        super();
        this._type = type;
        this._labelsArray=labelsArray;
        this._datasetJsonArray=datasetJsonArray;
     

    }

    generateChart(){

     
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