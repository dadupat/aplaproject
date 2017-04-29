'use strict';
class DataSet{

	constructor() {
		if (this.constructor === DataSet) {
			throw new TypeError("Can not construct abstract class.");
		}
		if (this.getColumnList === DataSet.prototype.getColumnList) {
			throw new TypeError("Please implement abstract method getColumnList.");
		}
		if (this.getDistinctColumnVal === DataSet.prototype.getDistinctColumnVal) {
			throw new TypeError("Please implement abstract method getDistinctColumnVal.");
		}
		if (this.getTableData === DataSet.prototype.getTableData) {
			throw new TypeError("Please implement abstract method getTableData.");
		}
		if (this.getQueryData === DataSet.prototype.getQueryData) {
			throw new TypeError("Please implement abstract method getQueryData.");
		}
	}
	
	// An abstract method to prepare column names.
	getColumnList() {
		throw new TypeError("Do not call abstract method getColumnName from child.");
	}
	
	// An abstract method for distinct column values from csv files.
	getDistinctColumnVal() {
		throw new TypeError("Do not call abstract method getDistinctColumnVal from child.");
	}

	// An abstract method to returns the data from csv files.
	getTableData(){
		throw new TypeError("Do not call abstract method getTableData from child.");
	}
	
	// An abstract method to creates the query to prepare dataRow from selected Column/Row  and return the resultset.
	getQueryData(){
		throw new TypeError("Do not call abstract method getQueryData from child.");
	}

	// displayColumns creates column level selection checkboxes dynamically.  
	displayColumns(columnNames){
        var instance = this;
		if(columnNames != undefined){
			var div = document.getElementById('columnCheckbox');
			var labelCol = document.createElement('label');
			labelCol.htmlFor="labelCol";
			labelCol.appendChild(document.createTextNode('Select Column :'));
			div.appendChild(labelCol);

			for(var i=0;i<columnNames.length-1;i++){
				var checkbox = document.createElement('input');
				checkbox.type = 'checkbox';
				checkbox.name = columnNames[i];
				checkbox.value = columnNames[i];
				checkbox.id = columnNames[i];
				checkbox.style.marginLeft="50px";
				checkbox.onchange =  (function(opt) {
											return function() {
											instance.onchangeHandler(opt, instance);
											};
										})(columnNames[i], instance);
				div.appendChild(checkbox);
				var label = document.createElement('label');
				label.htmlFor="id"+i;
				label.appendChild(document.createTextNode(columnNames[i].toString().replace(/[$]/g,' ')));
				div.appendChild(label);
			}
		}
    }

    // onchangeHandler perform action on Column checkbox selection dynamically. Show and hide row level selection with distinct data values.
    onchangeHandler(cb, instance){
        instance.cb = cb;
        this.getDistinctColumnVal(instance.cb).then(function(distinctArray){
            if(distinctArray != undefined){
               var chkbox=document.getElementById(instance.cb);
               var div = document.getElementById('multiselectdropdown');
               var selectBox = document.createElement('select');
               selectBox.name = instance.cb;
               selectBox.value = instance.cb;
               selectBox.style.marginRight="50px";
               selectBox.id = 'idselect'+instance.cb;
	
               if(selectBox.id != "idselectDeath$Cause" && selectBox.id != "idselectCancer$Type"){
                   selectBox.multiple=true;
               }

               for (var i = 0; i<distinctArray.length; i++){
                   var opt = document.createElement('option');
                   opt.value = distinctArray[i];
                   opt.innerHTML = distinctArray[i].toString().replace(/[$]/g,' ');
                   selectBox.appendChild(opt);
               }

               if (chkbox.checked) {
                       var label = document.createElement('label');
                       label.id= 'idlabel'+instance.cb;
                       label.appendChild(document.createTextNode('Select '+instance.cb.toString().replace(/[$]/g,' ')+' : '));
                       div.appendChild(label);
                       div.appendChild(selectBox);
               } else {
                   var div111 = document.getElementById('idselect'+instance.cb);
                   var div222 = document.getElementById('idlabel'+instance.cb);
                   div.removeChild(div111);
                   div.removeChild(div222);
               }
            }
        });
    }

	// calculateAndApplyAggFunction calculates the Minimum','Maximum','Average','Count','Standard Deviation' and apply the changes to UI.
    calculateAndApplyAggFunction(dataRows,flag){
		var typeFlag=2;
		if(flag){
			typeFlag=3
		}
        this.selectedArray = new Array(); 
        var aggFunct = ['Minimum','Maximum','Average','Count','Standard Deviation'];
        var divResult = document.getElementById('aggregateFunctionResult');
        aggregateFunctionResult.innerHTML = '';
        for(var i=0;i<aggFunct.length;i++){
            var aggElement = document.getElementById(aggFunct[i]);
            if(aggElement!=null && aggElement.checked ==  true){
                this.selectedArray.push(aggFunct[i]);
            }
         }

        if(this.selectedArray[0]!=null){
            var labelCl = document.createElement('label');
            labelCl.appendChild(document.createTextNode('Aggregate Function Result: '));
            var linebreak = document.createElement("br");
            divResult.appendChild(labelCl);
            divResult.appendChild(linebreak);
        }
        
        if(this.selectedArray.includes('Maximum')){
            var max =0;
            var maxValue =0;
            for (var i=0 ; i < dataRows.length ; i++) {
                if (parseFloat(dataRows[i][typeFlag]) > parseFloat(max)){
                    max = parseFloat(dataRows[i][typeFlag]);
                    maxValue = dataRows[i];
                }      
            }
            divResult.appendChild(document.createTextNode('Record with Maximum Value : '+maxValue.toString().replace(/[$]/g,' ')));
            var linebreak = document.createElement("br");
            divResult.appendChild(linebreak);
        }

        if(this.selectedArray.includes('Minimum')){
            var min =dataRows[0][typeFlag];
            var minValue =dataRows[0];
            for (var i=1 ; i < dataRows.length ; i++) {
                if (parseFloat(dataRows[i][typeFlag]) < parseFloat(min)){
                    min = parseFloat(dataRows[i][typeFlag]);
                    minValue = dataRows[i];
                }
                    
            }
            divResult.appendChild(document.createTextNode('Record with Minimum Value : '+minValue.toString().replace(/[$]/g,' ')));
            var linebreak = document.createElement("br");
            divResult.appendChild(linebreak);
        }

        var avgValue=0;
        for (var i=0 ; i < dataRows.length ; i++) {
            avgValue= parseFloat(avgValue)+parseFloat(dataRows[i][typeFlag]);
        }
        var avg= parseFloat(avgValue)/parseFloat(dataRows.length);

        if(this.selectedArray.includes('Average')){
            divResult.appendChild(document.createTextNode('Record with Average Value : '+avg));
            var linebreak = document.createElement("br");
            divResult.appendChild(linebreak);
        }

        if(this.selectedArray.includes('Count')){
            divResult.appendChild(document.createTextNode('Records Count : '+dataRows.length));
            var linebreak = document.createElement("br");
            divResult.appendChild(linebreak);
        }

        if(this.selectedArray.includes('Standard Deviation')){
            var total= 0;
            var diffavg=0;
            for(var i = 0; i < dataRows.length; i++) {
                diffavg = Math.pow((parseFloat(dataRows[i][typeFlag])-avg),2);
                total += diffavg;
            } 
            var temp23= parseFloat(total)/parseFloat(dataRows.length);
            var stdDeviation = Math.sqrt(temp23);
            divResult.appendChild(document.createTextNode('Standard deviation for records : '+stdDeviation));
            var linebreak = document.createElement("br");
            divResult.appendChild(linebreak);    
        } 
    }

	// createAggregateElements creates 'Minimum','Maximum','Average','Count','Standard Deviation' checkboxes dynamically on UI.
    createAggregateElements(){
        var inst = this;
        var divAgg = document.getElementById('aggregateFunction');
        var labelCol1 = document.createElement('label');
        labelCol1.htmlFor="labelCol1";
        labelCol1.appendChild(document.createTextNode('Select Aggregate Function:  '));
        divAgg.appendChild(labelCol1);
        
        var aggFunct = ['Minimum','Maximum','Average','Count','Standard Deviation'];
        for(var i=0;i<aggFunct.length;i++){
            var checkboxAgg = document.createElement('input');
            checkboxAgg.type = 'checkbox';
            checkboxAgg.name = aggFunct[i];
            checkboxAgg.value = aggFunct[i];
            checkboxAgg.id = aggFunct[i];
            checkboxAgg.style.marginLeft="50px";
            divAgg.appendChild(checkboxAgg);
            var labl = document.createElement('label');
            labl.appendChild(document.createTextNode(aggFunct[i]));
            divAgg.appendChild(labl);
        }  
    }

}