const crypto = require('node:crypto');

const requiredFields = ['title', 'time', 'price', 'date'];

const validateFlightData = (flightData) => {    
    // Check if all fields are present in the flight data object
    const inputFields = Object.keys(flightData);

    // Ensures all required fields are present in the input data
    return requiredFields.every(reqField => ( inputFields.indexOf(reqField) > -1 ));
}

const filterFlightData = (flightData) => {
    return requiredFields.reduce((accumulator, requiredField) => {
        accumulator[requiredField] = flightData[requiredField];
        return accumulator;
    }, {});
}

const addIdToData = data => ({id: crypto.randomBytes(20).toString('hex'), ...data});

module.exports = {
    validateFlightData,
    filterFlightData,
    addIdToData
}