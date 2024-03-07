const ParkingLot = require("../model/parkingLot");
exports.Parkings = async (req,res)=>{
    try {
        const { parkingLotId, registrationNumber, color } = req.body;
    
        const parkingLot = await ParkingLot.findOne({ id: parkingLotId }); 
    
        if (!parkingLot) {
          return res.status(404).json({
            isSuccess: false,
            message: "Parking lot not found or inactive",
          });
        }
    
        if (parkingLot.availableSlots === 0) {
          return res.status(400).json({
            isSuccess: false,
            message: "Parking lot is full",
          });
        }
    
        const existingCar = parkingLot.parkedCars.find(
          (car) => car.registrationNumber === registrationNumber
        );
        if (existingCar) {
          return res.status(400).json({
            isSuccess: false,
            message: "Car with this registration number is already parked",
          });
        }
    
        let success = false;
        let newSlotNumber = 0;
        for (let i = 0; i < parkingLot.parkedCars.length; i++) {
          if (parkingLot.parkedCars[i].isActive === false) {
            parkingLot.parkedCars[i].isActive = true;
            parkingLot.parkedCars[i].registrationNumber = registrationNumber;
            parkingLot.parkedCars[i].color = color;
            parkingLot.parkedCars[i].entryTime = Date.now();
            parkingLot.availableSlots--;
            success = true;
            newSlotNumber = i + 1;
            break;
          }
        }
    
        if (!success) {
          throw new Error();
        }
    
        await parkingLot.save();
    
        res.status(201).json({
          isSuccess: true,
          response: {
            slotNumber: newSlotNumber,
            status: "PARKED",
          },
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({
          isSuccess: false,
          message: "Error parking car",
        });
      }
}

exports.ParkingDelete = async (req,res)=>{
    try {
        const { parkingLotId, registrationNumber } = req.body;
    
        if (!parkingLotId || !registrationNumber) {
          return res.status(400).json({
            isSuccess: false,
            message:
              'Missing required information. Please provide "parkingLotId" and "registrationNumber"',
          });
        }
    
        const parkingLot = await ParkingLot.findOne({ id: parkingLotId });
        if (!parkingLot) {
          return res.status(404).json({
            isSuccess: false,
            message: "Parking lot not found or inactive",
          });
        }
    
        const parkedCarIndex = parkingLot.parkedCars.findIndex(
          (car) => car.registrationNumber === registrationNumber
        );
        if (parkedCarIndex === -1) {
          return res.status(404).json({
            isSuccess: false,
            message:
              "Car with this registration number not found in the parking lot",
          });
        }
    
        parkingLot.availableSlots++;
        parkingLot.parkedCars[parkedCarIndex] = {
          isActive: false,
          registrationNumber: "",
          color: "",
          slotNumber: parkedCarIndex,
          entryTime: Date.now(),
        };
    
        await parkingLot.save();
    
        res.status(200).json({
          isSuccess: true,
          response: {
            slotNumber: parkedCarIndex + 1,
            registrationNumber: registrationNumber,
            status: "LEFT",
          },
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({
          isSuccess: false,
          message: "Error leaving car",
        });
      }
}

