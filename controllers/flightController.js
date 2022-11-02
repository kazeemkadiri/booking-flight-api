const { validateFlightData, filterFlightData, addIdToData } = require('../utils/dataUtils');
const { addToDB } = require('../utils/databaseUtils');

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

module.exports = {
    addFlight
}

