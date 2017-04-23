'use strict'
class DashBoard {
    createTable(dataType){
        var instance = this;
        var dataSetFactory = new DataSetFactory();
        var dataSet = dataSetFactory.getDataSet(dataType);
        dataSet.getTableData().then(function(tableData){
            if(tableData != undefined){
                instance.displayTable(tableData);
            }
        });
        dataSet.displayColumns();
    }

    displayTable(tableData){
        var table = document.createElement('table');
        var tableBody = document.createElement('tbody');
        table.className = "table";
        var tableHeader = table.createTHead();
        var rowHead = tableHeader.insertRow(0);
        var column1 = rowHead.insertCell(0);
        var column2 = rowHead.insertCell(1);
        var column3 = rowHead.insertCell(2);
        var column4 = rowHead.insertCell(3);
        column1.innerHTML = "<h3>Year</h3>";
        column2.innerHTML = "<h3>Gender</h3>";
        column3.innerHTML = "<h3>CancerType</h3>";
        column4.innerHTML = "<h3>CaseRate</h3>";
        var newDiv = document.createElement('div');
        newDiv.style.height = "100px!important";
        var row = document.createElement('tr');
        for(var i=0; i<tableData.length; i++){
            var row = document.createElement('tr');
            for(var j=0; j<tableData[i].length; j++){
                 var column = document.createElement('td');
                 column.textContent = tableData[i][j];
                 row.appendChild(column);
            }
            tableBody.appendChild(row);
        }
        table.appendChild(tableBody);
        newDiv.appendChild(table);
        document.getElementById('toAppend').appendChild(newDiv);
    }

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
}

var dashboard = new DashBoard();