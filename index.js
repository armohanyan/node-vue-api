const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// env
require("dotenv").config();
const port = process.env.PORT || 3000;

// controllers
const postController = require("./controllers/postsController");
const authentiocationController = require("./controllers/authenticationController");

// database
mongoose.connect(process.env.DB_URL)
.then(() => console.log("Successfully connected database"))
.catch(err => console.log(err));

// ----------------------------------------

// MIDDLEWARE
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// -------------------------------- API ---------------------------------------

// post
app.get("/posts", async (req, res) => {
    const posts = await postController.getPosts();
    res.status(200).json(posts);
});

// user
app.post("/sign-up", async (req, res) => {
    const response = await authentiocationController.signUp(req.body);
    res.status(200).json(response);
});

// cookie 
app.get("/set-cookie", (req, res) => {
    res.cookie("newUser", false, {maxAge: 1000 * 60 * 60 * 24, httpOnly: true});
    res.send("You create cookie")

    // maxAge: 1000 * 60 * 60 * 24 = exp. is 1 day; 
    // httpOnly is accept only http requests; 
    // secure: true is accept only https requests; 
});

app.get("/read-cookie", (req, res) => {
    const cookies = req.cookies
    res.json(cookies)
})


// listen port
app.listen(port, () => console.log(`Server started on port ${port}`));