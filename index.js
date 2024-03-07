const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 4000;
require("./config/database").dbConnect();

const cors = require("cors");
const bodyParser = require("body-parser");


app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use('/api',require('./router/useRouter'))

app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});
