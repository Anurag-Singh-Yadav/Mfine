const ParkingLot = require("../model/parkingLot");

exports.getParking = async(req, res) => {
    try {
      const { color, parkingLotId } = req.query;
  
      if (!color || !parkingLotId) {
        return res.status(400).json({
          isSuccess: false,
          message:
            'Missing required parameters. Please provide "color" and "parkingLotId"',
        });
      }
  
      const parkingLot = await ParkingLot.findOne({ id: parkingLotId });
      if (!parkingLot) {
        return res.status(404).json({
          isSuccess: false,
          message: "Parking lot not found or inactive",
        });
      }
  
      const matchingCars = parkingLot.parkedCars.filter(
        (car) => car.color === color.toUpperCase() && car.slotNumber
      );
  
      if (!matchingCars.length) {
        return res.status(404).json({
          isSuccess: false,
          message: "No cars found with this color in the parking lot",
        });
      }
  
      const response = matchingCars.map((car) => ({
        registrationNumber: car.registrationNumber,
        slotNumber: car.slotNumber,
        color: car.color,
        status: "LEFT",
      }));
  
      res.status(200).json({
        isSuccess: true,
        response,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        isSuccess: false,
        message: "Error fetching car information",
      });
    }
};


exports.getSlots = async (req, res) => {
    try {
      const { color, parkingLotId } = req.query;
  
      if (!color || !parkingLotId) {
        return res.status(400).json({
          isSuccess: false,
          error: {
            reason: "Missing required color or parkingLotId parameter",
          },
        });
      }
  
      const parkingLot = await ParkingLot.findOne({ id: parkingLotId });
      if (!parkingLot) {
        return res.status(404).json({
          isSuccess: false,
          error: {
            reason: "Parking lot not found or inactive",
          },
        });
      }
  
      const matchingCars = parkingLot.parkedCars
        .filter((car) => car.color === color.toUpperCase())
        .sort((a, b) => a.slotNumber - b.slotNumber); 
  
      if (!matchingCars.length) {
        return res.status(200).json({
          isSuccess: false,
          error: {
            reason: `No car found with color ${color}`,
          },
        });
      }
  
      const slots = matchingCars.map((car) => ({
        color: car.color,
        slotNumber: car.slotNumber,
      }));
  
      res.status(200).json({
        isSuccess: true,
        response: {
          slots,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(200).json({
        isSuccess: false,
        error: {
          reason: "Error fetching car information",
        },
      });
    }
  };