//jshint esversion: 8

const express = require('express');
const bodyParser  = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get("/", function (req,res) {
    res.sendFile(__dirname + "/index.html");
});

//#region BMI calculatorPage("/BMI")
app.get("/BMI" , function (req,res) {
   res.render("bmiCalculator" , {homeNavActive: "" , BMINavActive: "active" , toDoListNavActive: "", weatherNavActive: "", signUpNavActive: ""});
});

app.listen(3000, function () {
    console.log("server is started on port 3000");
});