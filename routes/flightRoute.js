const express = require('express');

const router = express.Router();
const controller = require('../controllers/flightController');

// returns all flights data
router.get('/', controller.allFlights);

// This route adds a new flight record to the database
router.post('/add', controller.addFlight);

module.exports = router;
