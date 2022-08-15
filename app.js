//jshint esversion: 8

const express = require('express');
const bodyParser  = require('body-parser');
const date = require(__dirname + "/data.js");

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

app.listen(3000, function () {
    console.log("server is started on port 3000");
});