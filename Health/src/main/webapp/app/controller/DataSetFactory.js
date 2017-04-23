class DataSetFactory {
	DataSetFactory instance;
	let _singleton = Symbol();
	
	var accidentDataSet = new AccidentDataSet();
	var birthDataSet = new BirthDataSet();
	var cancerDataSet = new CancerDataSet();
	var insuranceDataSet = new InsuranceDataSet();
	var mortalityDataSet = new MortalityDataSet();
	
    constructor (singletonToken) {
    	if (_singleton != singletonToken){
    	 throw new Error('Cannot instantiate directly.');
    	}
    }

    static getFactory (){
    	if (!this[_singleton])
    		this[_singleton] = new DataSetFactory(_singleton);
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