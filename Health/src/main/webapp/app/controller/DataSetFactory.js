class DataSetFactory {
    constructor () {

    }

    /*static getFactory (){
        this.accidentDataSet = new AccidentDataSet();
        this.birthDataSet  = new BirthDataSet();
        this.cancerDataSet = new CancerDataSet();
        this.insuranceDataSet = new InsuranceDataSet();
        this.mortalityDataSet = new MortalityDataSet();
    	return new DataSetFactory();
    }*/
    
    getDataSet(DataSetName){
    	if (DataSetName == 'accident'){
        	return this.accidentDataSet;
        }
        if (DataSetName == 'birth'){
        	return this.birthDataSet;
        }
        if (DataSetName == 'cancer'){
        	return new CancerDataSet();
        }
        if (DataSetName == 'insurance'){
        	return this.insuranceDataSet;
        }
        if (DataSetName == 'mortality'){
        	return this.mortalityDataSet;
        }
    }
}