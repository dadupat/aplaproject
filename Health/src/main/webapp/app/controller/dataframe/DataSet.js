'use strict';
class DataSet{

	constructor() {
		if (this.constructor === DataSet) {
			throw new TypeError("Can not construct abstract class.");
		}
		if (this.getColumnName === DataSet.prototype.getColumnName) {
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
	
	// An abstract method.
	getColumnList() {
		throw new TypeError("Do not call abstract method getColumnName from child.");
	}
	
	// An abstract method.
	getDistinctColumnVal() {
		throw new TypeError("Do not call abstract method getDistinctColumnVal from child.");
	}

	getTableData(){
		throw new TypeError("Do not call abstract method getTableData from child.");
	}
	
	getQueryData(){
		throw new TypeError("Do not call abstract method getQueryData from child.");
	}
}