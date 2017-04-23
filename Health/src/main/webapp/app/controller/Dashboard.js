'use strict'
class DashBoard{

    getMultiSelectData(){
        var gender = document.getElementById('idselectGender');
        var year = document.getElementById('idselectYear');
        var cancerType = document.getElementById('idselectCancerType');
        var valuesGender = [];
        var valuesYear = [];
        var valuesCancer = [];

        if(null != gender){
            for (var i = 0; i < gender.options.length; i++) {
                if (gender.options[i].selected) {
                    valuesGender.push(gender.options[i].value);
                }
            }
        }

        if(null != year){
            for (var i = 0; i < year.options.length; i++) {
                if (year.options[i].selected) {
                    valuesYear.push(year.options[i].value);
                }
            }
        }

        if(null != cancerType){
            for (var i = 0; i < cancerType.options.length; i++) {
                if (cancerType.options[i].selected) {
                    valuesCancer.push(cancerType.options[i].value);
                }
            }
        }
        var cancerData = new CancerData();
        cancerData.getCancerQuery(valuesCancer, valuesGender, valuesYear);
    }

    getCancerData(){
        var cancerData = new CancerData();
        cancerData.getCancerData();
    }
}

var dashboard = new DashBoard();