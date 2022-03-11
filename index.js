const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// env
require("dotenv").config();
const port = process.env.PORT || 3000;

// routes 
const postRoutes = require("./routes/postRoutes");
const authRoutes  = require("./routes/authRoutes");

// database
mongoose.connect(process.env.DB_URL)
  .then(() => console.log("Successfully connected database"))
  .catch(err => { throw err })

// ----------------------------------------

// MIDDLEWARE
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: [ 'http://localhost:8080' ]
}))

// use routes   
app.use(postRoutes);
app.use(authRoutes);

// listen port
app.listen(port, () => console.log(`Server started on port ${port}`));
