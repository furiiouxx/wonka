// Ann Maria Jiji
// 2227522
// DISM2B04

const express = require("express");
const app = express();

// to know what has been retreived and showed
app.use(function(req,res,next){
    const {method, url} = req;

    console.log(`Received Method = ${method} Url = ${url}`);
    next();
});

app.use(express.static("public"));

// to make the urls work
app.get("/", (req, res) => {  // access homepage
    res.sendFile("/public/index.html", { root: __dirname });
});

app.get("/login/", (req, res) => { // access login page
    res.sendFile("/public/login.html", { root: __dirname });
});

app.get("/users/:id", (req, res) => { // view own user profile
    res.sendFile("/public/adminProfile", "/public/customerProfile.html", { root: __dirname });
});

app.get("/gameDetails/", (req, res) => { // adding game details page
    res.sendFile("/public/gameDetails.html", { root: __dirname });
  });



/* for customer and admin profile, needa use a JS script in this file to determin which file to show based on 
the req.type. so in the back end when passing the reponse, gotta create a header with the req.type in it. so that 
it can be called here */

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Front-End Client server has started listening on port ${PORT}`);
});