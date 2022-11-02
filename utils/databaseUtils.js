const { join } = require('path');
const { 
    readFileSync, 
    writeFileSync, 
    existsSync,
    openSync,
    mkdirSync,
    closeSync
 } = require('fs');
const { VALID_FLIGHT_FIELDS } = require('./constants');

const dbPath = join(__dirname, '..', 'data', 'db.json');

const createDB = () => {
    // create data directory that holds db.json file
    mkdirSync(join(__dirname, '..', 'data'));

    // Create db.json file to be used as a database
    const fd = openSync(dbPath, 'w');

    closeSync(fd);

    return true;
}

const readFromDB = () => {

    // Attempts to create a database (db.json) if it doesn't exist
    if(!existsSync(dbPath)){

        try{
        
            createDB();
        
        }catch(err){

            throw new Error(err);
            
        }
    }

    const dbData = readFileSync(dbPath, 'utf8');
    
    // if db.json is empty, return an empty array
    if(dbData === '') return [];

    // if db.json has some content, parse it and return the value
    return JSON.parse(dbData);
};

const addToDB = (newData) => {
    try{
        const dbData = readFromDB();

        dbData.push(newData);

        writeFileSync(dbPath, JSON.stringify(dbData), { encoding: 'utf8' });
    }catch(err){
        return false;
    }
    return true;
};

const getFlightFromDB = (flightId) => {
    try{
        return readFromDB().find((flight) => flight.id === flightId);
    }catch(err){
        return null;
    }
}

const updateFlightInDB = (flightId, updateParams) => {
    const flightFound = getFlightFromDB(flightId);

    if(!flightFound) throw new Error('Incorrect flight id specified');

    // validate the update params
    const isValidParams = Object.keys(updateParams).every(fieldToUpdate => ( VALID_FLIGHT_FIELDS.indexOf(fieldToUpdate) > -1 ));

    if(!isValidParams) throw new Error('Invalid update params');

    // Update the flight object using the values in update params
    const updatedFlightData = { ... flightFound, ...updateParams};

    const dbData = readFromDB();

    const flightIndex = dbData.findIndex((flight) => (flight.id === flightFound.id));

    dbData[flightIndex] = updatedFlightData;

    writeFileSync(dbPath, JSON.stringify(dbData), { encoding: 'utf8' });

    return updatedFlightData;
}

module.exports = {
    addToDB,
    readFromDB,
    getFlightFromDB,
    updateFlightInDB
}