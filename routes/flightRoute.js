const express = require('express');

const router = express.Router();
const controller = require('../controllers/flightController');

//router.get('/', controller.example);

// This route adds a new flight record to the database
router.post('/add', controller.addFlight);

module.exports = router;
