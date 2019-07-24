var express = require('express');
var app = express();
var router = express.Router();
var pg = require('pg');
var db = require('../myModules/accessDB.js');
var postEncoding = express.urlencoded({extended: true});

// assignments home.
router.get('/', (req, res, next) => {
  res.render('pages/index');
});

// splash page for sphinx Manager
router.get('/sphinxmanager', (req, res, next) => {
  res.render('pages/splash.ejs');
});

// login
router.post('/login', postEncoding, (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  if(username && password){
    res.redirect('/sphinxhome')
  }
  else{
    res.redirect('/sphinxmanager');
  }
});

// employer home
router.get('/sphinxhome', async (req, res) => {
  db.getSchedule(function(results){
    res.render('pages/sphinxHome.ejs', results);
  })
});

// employees
router.get('/employees', async (req, res) => {
    db.employeeManage(function(results){
      res.render('pages/employees', results);
    });
});

// edit shift
router.post('/editShift', (req, res) => {
  console.log(req.body.edit);
  console.log(req.body.del);
  var shifts = req.body;
  var shifts = shifts['shift[]'];
  console.log(shifts);

  // if delete is selected
  if(req.body.del){

    // if multiple deletes
    if(Array.isArray(shifts)){
    shifts.forEach (s =>{
      console.log(s);
      db.deleteShift(s);
    })
  }
    // just one
    else(db.deleteShift(shifts));

    // refresh page
    res.redirect('/sphinxhome');
  }

  // if edit is selected go to the edit shift page
  else{
    console.log("get list of employees");
    db.getEmployeeList(function(empList){
      empList = empList.results;
      var results = new Object();
      results.empList = empList;
      results.shifts = shifts;
      console.log(results);
      res.render('pages/editShift.ejs', results);
    });
  }
})

// add or remove employees from shift
router.post('/addToShift', (req, res) => {
  var shifts = JSON.parse("[" + req.body.shifts + "]");
  var empID = req.body.empID;
  var add = req.body.add;
  var del = req.body.del;

  if(add){
    shifts.forEach(s => {
      db.addEmployees(s, empID);
    });
  }
  else if(del){
    shifts.forEach(s => {
      db.removeEmp(s);
    });
  }
  res.redirect('/sphinxhome');
});

// add new shift
router.post('/newShift', async (req, res) => {
  var params = [
    req.body.shift,
    req.body.day
  ]
  db.newShift(params, function(){
    res.redirect('/sphinxhome');
  })
});

// add new employee
router.post('/addNew', async (req, res, next) => {
  var params = [
    1,
    req.body.name,
    req.body.wage,
    req.body.hireDate,
    req.body.position
  ]
  db.newEmployee(params, function(){
    res.redirect('/employees');
  })
});

// delete employees
router.post('/deleteEmp', (req, res) => {
  var empID = req.body.id;
  console.log(empID);
  db.deleteEmp(empID);
  res.redirect('/employees');
});

// get rates for postage calculator 
router.get('/getRate', (req, res) => {
  var rates = require('../myModules/rates');
  var data = {
    weight: req.query.weight,
    type: req.query.type
  }
  console.log("This is getRate:" + data);
  var cRate = rates.calcRate(data);
  if(req.query.weight){
    res.render('pages/pRate', {rate: cRate});
  }
  else res.render('pages/index');
});

module.exports = router;
