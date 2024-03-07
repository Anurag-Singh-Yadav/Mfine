const express = require('express');
const router = express.Router();

const { ParkingLots} = require('../controllers/parkingLots');
const { getParking, getSlots } = require('../controllers/get');
const { ParkingDelete, Parkings } = require('../controllers/parking');


router.post('/ParkingLots', ParkingLots);
router.post("/api/Parkings",Parkings);

router.delete("/api/Parkings",ParkingDelete);

router.get('/api/Parkings', getParking);
router.get("/api/Slots", getSlots)

module.exports = router;