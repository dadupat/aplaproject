'use strict'
class DashBoard{

    createTable(dataType){
        var dataSet = DataSetFactory.getFactory().getDataSet(dataType);
        var columnNames = dataSet.getColumnList();
        var tableData = dataSet.getTableData();
        this.displayColumnNames(columnNames)
        this.displayTable(tableData, columnNames)
        this.displayColumnNames(columnNames);
    }

    displayTable(tableData, columnNames){
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

    displayColumnNames(columnNames){
        var div = document.getElementById('columnCheckbox');
        var labelCol = document.createElement('label');
        labelCol.htmlFor="labelCol";
        labelCol.appendChild(document.createTextNode('Select Column'));
        div.appendChild(labelCol);

        for(var i=0;i<columnNames.length-1;i++){
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = columnNames[i];
            checkbox.value = columnNames[i];
            checkbox.id = columnNames[i];
            checkbox.onchange = new Function("onchangeHandler('" + columns[i] + "')");
            div.appendChild(checkbox);
            var label = document.createElement('label');
            label.htmlFor="id"+i;
            label.appendChild(document.createTextNode(columnNames[i]));
            div.appendChild(label);
        }
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