class DataSetFactory {
    constructor () {

    }

    getDataSet(DataSetName){
    	if (DataSetName == 'accident'){
        	return new AccidentDataSet();
        }
        if (DataSetName == 'birth'){
        	return new BirthDataSet();
        }
        if (DataSetName == 'cancer'){
        	return new CancerDataSet();
        }
        if (DataSetName == 'insurance'){
        	return new InsuranceDataSet();
        }
        if (DataSetName == 'mortality'){
        	return new MortalityDataSet();
        }
    }
}