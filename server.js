const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const DB = require("./config/keys").MONGOURI;
mongoose.connect(
  DB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to DB");
  }
);

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload());

app.use("/api/user", require("./routes/userRoute"));
app.use("/api/classRoom", require("./routes/classroomRoutes"));
const port = 4000;
app.listen(port, () => {
  console.log(`server running at ${port}`);
});

module.exports = app;
