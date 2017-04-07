class StackedChart extends ChartObserver {

    constructor (type, data) {
        super();
        this.type = type;
        this.data= data;
    }

    generateChart(){
        var ctx = document.getElementById("lineChart");
        var lineChart1 = new Chart(ctx, {
            type: this.type,
            data: {
              labels: this.data.labels,
              datasets: [{
                label: this.data.label,
                data: this.data.data
              }]
            }
        });
    }
}