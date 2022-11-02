const express = require('express');

const router = express.Router();
const controller = require('../controllers/flightController');

// returns all flights records
router.get('/', controller.allFlights);

// Adds a new flight record to the database
router.post('/add', controller.addFlight);

// Get single flight data using its ID
router.get('/:id', controller.getFlight);

// Update a flight using its id and update values
router.patch('/:id/update', controller.updateFlight);

// Delete a flight record using its id
router.delete('/:id/delete', controller.deleteFlight);

module.exports = router;
