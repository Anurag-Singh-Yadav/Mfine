const ParkingLot = require("../model/parkingLot");
const { v4: uuidv4 } = require("uuid");
exports.ParkingLots = async (req, res) => {
  try {
    const { capacity, id } = req.body;
    const parkingLot = await ParkingLot.findOne({ id: id });
    if (capacity < 0 || capacity > 2000) {
      return res.status(400).json({
        isSuccess: false,
        message:
          "Invalid capacity provided. Capacity must be between 0 and 2000.",
      });
    }

    if (id && (!/^[0-9a-f]{24}$/i.test(id) || typeof id !== "string")) {
      return res.status(400).json({
        isSuccess: false,
        message:
          "Invalid id provided. ID should be a 24-character hexadecimal string.",
      });
    }

    const newParkingLot = new ParkingLot({
      capacity,

      id: id || uuidv4(),
      isActive: true,
    });

    await newParkingLot.save();

    res.status(201).json({
      isSuccess: true,
      response: {
        id: newParkingLot.id,
        capacity,
        isActive: newParkingLot.isActive,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      isSuccess: false,
      message: "Error creating parking lot",
    });
  }
};
