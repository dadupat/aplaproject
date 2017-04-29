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
		if (this.displayColumns === DataSet.prototype.displayColumns) {
            throw new TypeError("Please implement abstract method displayColumns.");
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

}