class DataSetFactory {

    constructor (singletonToken) {
    	if (_singleton != singletonToken){
    	    throw new Error('Cannot instantiate directly.');
    	}
    }

    static getFactory (){
    	if (!this._singleton){
    	    accidentDataSet = new AccidentDataSet();
        	birthDataSet = new BirthDataSet();
        	cancerDataSet = new CancerDataSet();
        	insuranceDataSet = new InsuranceDataSet();
        	mortalityDataSet = new MortalityDataSet();
    		this._singleton = new DataSetFactory(_singleton);
    	}
    	return this[_singleton]
    }
    
    getDataSet(DataSetName){
    	if (DataSetName == 'accident'){
        	return accidentDataSet;
        }
        if (DataSetName == 'birth'){
        	return birthDataSet;
        }
        if (DataSetName == 'cancer'){
        	return cancerDataSet;
        }
        if (DataSetName == 'insurance'){
        	return insuranceDataSet;
        }
        if (DataSetName == 'mortality'){
        	return mortalityDataSet;
        }
    }
}