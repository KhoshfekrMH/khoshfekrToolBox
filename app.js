//jshint esversion: 8

const express = require('express');
const bodyParser  = require('body-parser');
const https = require("https");
const date = require(__dirname + "/data.js");
const api = require(__dirname + "/apiKey.js");
const {response} = require("express");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get("/", function (req,res) {
    res.sendFile(__dirname + "/index.html");
});

//#region BMI calculatorPage("/BMI")
app.get("/BMI" , function (req,res) {
   res.render("bmiCalculator" , {homeNavActive: "" , BMINavActive: "active" , toDoListNavActive: "", weatherNavActive: "", signUpNavActive: "", resultBMI:"", leftAnimationlink:"", rightAnimationlink:""});
});

app.post("/BMI" , function (req,res) {
    let weight = Number(req.body.weightBox);
    let height = Number(req.body.heightBox);

    let resultBMI = (weight / ((height * height) / 10000)).toFixed(2);

    if(resultBMI < 18.6){
        res.render("bmiCalculator", {homeNavActive: "" , BMINavActive: "active" , toDoListNavActive: "", weatherNavActive: "", signUpNavActive: "", resultBMI: "your bmi is " + resultBMI + " and you are under weight 😰", leftAnimationlink:"" , rightAnimationlink:""});
    } else if(resultBMI >= 18.6 && resultBMI < 24.9){
        res.render("bmiCalculator", {homeNavActive: "" , BMINavActive: "active" , toDoListNavActive: "", weatherNavActive: "", signUpNavActive: "", resultBMI: "your bmi is " + resultBMI + " and you are Normal 😎", leftAnimationlink:"https://assets9.lottiefiles.com/packages/lf20_qel8j26q.json" , rightAnimationlink:"https://assets9.lottiefiles.com/packages/lf20_qel8j26q.json"});
    } else if(resultBMI > 18.6){
        res.render("bmiCalculator", {homeNavActive: "" , BMINavActive: "active" , toDoListNavActive: "", weatherNavActive: "", signUpNavActive: "", resultBMI: "your bmi is " + resultBMI + " and you are Over Weight 😐",leftAnimationlink:"" , rightAnimationlink:""});
    } else {
        res.render("bmiCalculator", {homeNavActive: "" , BMINavActive: "active" , toDoListNavActive: "", weatherNavActive: "", signUpNavActive: "", resultBMI: "No Answer"});
    }
});
//#endregion

//#region TODOLIST page("/ToDoList")
const items = ["buy food", "cook food", "eat food"];
app.get("/ToDoList",function (req,res) {
    const dayTime = date.getData();
   res.render("toDoList" , {
       homeNavActive: "",
       BMINavActive: "",
       toDoListNavActive: "active",
       weatherNavActive: "",
       signUpNavActive: "",
       listTitle: dayTime,
       newListItems: items
   });
});

app.post("/ToDoList", function (req,res) {
    const item = req.body.newItem;
    items.push(item);
    res.redirect("/ToDoList");
});
//#endregion

//#region Weather page("/Weather")
app.get("/Weather", function (req,res) {
    res.render("Weather" , {
        homeNavActive: "",
        BMINavActive: "",
        toDoListNavActive: "",
        weatherNavActive: "active",
        signUpNavActive: "",
        weatherIcon: "",
        weatherTemperature: "",
        weatherDescription: ""
    });
});

app.post("/Weather", function (req,res) {
    const city = req.body.citySelection;
    const unit = req.body.tempUnit;
    const APIkey = api.APIweather;

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + unit + "&appid=" + APIkey;

    https.get(url, function (response) {
        console.log(response.statusCode);
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const temperature = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = " http://openweathermap.org/img/wn/" + icon + "@2x.png";

            res.render("Weather" , {
                homeNavActive: "",
                BMINavActive: "",
                toDoListNavActive: "",
                weatherNavActive: "active",
                signUpNavActive: "",
                weatherIcon: imageURL,
                weatherTemperature: temperature,
                weatherDescription: weatherDescription
            });
        });
    });
});
//#endregion

//#region Mailchimp page("/Mailchimp")
app.get("/Mailchimp", function (req,res) {
    res.render("Mailchimp" , {
        homeNavActive: "",
        BMINavActive: "",
        toDoListNavActive: "",
        weatherNavActive: "",
        signUpNavActive: "active",
        alertSuccess: "hidden",
        alertFailure: "hidden"
    });
});

app.post("/Mailchimp", function (req,res) {
    const email = req.body.emailInput;
    const firstName = req.body.firstNameInput;
    const lastName = req.body.lastNameInput;

    let data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const listCode = api.mailchimpListCode;
    const APIkey = api.APImailchimp;
    const url = "https://us14.api.mailchimp.com/3.0/lists/" + listCode;

    const options = {
        method: "POST",

        auth: APIkey
    }

    const request = https.request(url, options, function (response) {
        response.on("data", function (data) {
            console.log(JSON.parse(data));

            if(response.statusCode === 200){
                res.render("Mailchimp" , {
                    homeNavActive: "",
                    BMINavActive: "",
                    toDoListNavActive: "",
                    weatherNavActive: "",
                    signUpNavActive: "active",
                    alertSuccess: "visible",
                    alertFailure: "hidden"
                });
            } else {
                res.render("Mailchimp" , {
                    homeNavActive: "",
                    BMINavActive: "",
                    toDoListNavActive: "",
                    weatherNavActive: "",
                    signUpNavActive: "active",
                    alertSuccess: "hidden",
                    alertFailure: "visible"
                });
            }
        });
    });

    request.write(jsonData);
    request.end();
});
//#endregion

app.listen(process.env.PORT || 3000, function () {
    console.log("server is started on port 3000");
});