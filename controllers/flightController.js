const { validateFlightData, filterFlightData, addIdToData } = require('../utils/dataUtils');
const { 
    addToDB, 
    readFromDB, 
    getFlightFromDB, 
    updateFlightInDB,
    deleteFlightFromDB 
} = require('../utils/databaseUtils');

const addFlight = (req, res) => {
    const flightData = req.body;

    const isValidData = validateFlightData(flightData);
    
    if(!isValidData){
        return res.status(500).json({message: 'Invalid data received'}).end();
    }

    // Get only required fields
    const filteredFlightData = filterFlightData(flightData);

    // Generate a random id for the flight data
    const dataWithId = addIdToData(filteredFlightData);

    // If data is valid
    try{
        // Save the data to database (db.json)
        const savedResult = addToDB(dataWithId);

        if(!savedResult){
            return res.status(500).json({message: 'Errors were encountered while trying to save the new flight data'}).end();        
        }

        return res.status(200).json({message: 'New flight data has been saved successfully'}).end();
    }catch(err){
        return res.status(500).json({message: err}).end();
    }
}

const allFlights = (req, res) => {
    try{

        const flights = readFromDB();
    
        return res.status(200).json({data: flights});

    }catch(err){
        return res.status(500).json({message: err}).end();
    }
}

const getFlight = (req, res) => {
    try{

        const flightId = req.params.id;

        const flight = getFlightFromDB(flightId);

        return res.status(200).json({data: flight});

    }catch(err){
        return res.status(500).json({message: err}).end();
    }
}

const updateFlight = (req, res) => {
    try{

        const flightId = req.params.id;

        const updateParams = req.body;
        
        const updatedFlight = updateFlightInDB(flightId, updateParams);

        return res.status(200).json({data: updatedFlight}).end();

    }catch(err){
        return res.status(500).json({message: err}).end();
    }
}

const deleteFlight = (req, res) => {
    const flightDeleted = deleteFlightFromDB(req.params.id);
    
    if(!flightDeleted) return res.status(500).json({message: 'Failed to delete flight'}).end();

    return res.status(200).json({data: true}).end();
}

module.exports = {
    addFlight,
    allFlights,
    getFlight,
    updateFlight,
    deleteFlight
}

