const mongoose = require("mongoose");
require("dotenv").config();
exports.dbConnect = () => {
  mongoose
    .connect(process.env.MONGOOSE_URL, {})
    .then(() => {
      console.log("db connected successfull");
    })
    .catch(() => {
      console.log("error connecting");
      console.log(err);
      process.exit(1);
    });
};
