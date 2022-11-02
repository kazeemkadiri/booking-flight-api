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

        saveToDB(dbData);

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

    saveToDB(dbData);

    return updatedFlightData;
}

const saveToDB = (dbData) => {
    try{
        writeFileSync(dbPath, JSON.stringify(dbData), { encoding: 'utf8' });
        return true;
    }catch(err){
        throw new Error('Failed to save to database');
    }
}

const deleteFlightFromDB = (flightId) => {
    let dbData = readFromDB();
    
    // No data was found in the database
    if(dbData.length === 0){
        return false;
    }

    const flightIndex = dbData.findIndex((flight) => (flight.id === flightId));

    if(flightIndex === -1){
        return false;
    }

    // removes the flight from the db
    dbData.splice(flightIndex, 1);

    const deleteUpdate = saveToDB(dbData);

    if(!deleteUpdate) return false;

    return true;
}

module.exports = {
    addToDB,
    saveToDB,
    readFromDB,
    getFlightFromDB,
    updateFlightInDB,
    deleteFlightFromDB
}