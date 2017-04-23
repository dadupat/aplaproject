'use strict'
class DashBoard{
    // Change this to get from factory object where ever necessary.
    //Should be singleton and evry time should give the same instance
    var cancerData = new CancerData();


    //Modify this should be more functionality specific.
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

        // it should return an array and use that value to change UI here
        cancerData.getCancerQuery(valuesCancer, valuesGender, valuesYear);
    }

    // this method should accept type from UI and on the basis of type it should call respective TableGeneration Logic.
    getCancerTable(dataType){
        //check if condition
        cancerData.getCancerTable();
    }

    getColumnName(){
        // should return array
        cancerData.getColumnName();
        // use that return array value to add logic to Change UI.
    }

}

var dashboard = new DashBoard();