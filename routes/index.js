var express = require('express');
var app = express();
var router = express.Router();
var pg = require('pg');
var updateDB = require('../myModules/accessDB.js');
var local = 'postgres://@localhost/project_njs'; // for local access
var heroku = process.env.DATABASE_URL;
var postEncoding = express.urlencoded({extended: true});


// db connection
const { Pool } = require('pg')
const pool = new Pool({
  connectionString: local,
  ssl: false
});

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
  console.log(req.body);
  res.redirect('/sphinxhome');
});

// employer home
router.get('/sphinxhome', async (req, res) => {
  var query = "select shift_id, shift, to_char(day, 'Mon dd yyyy'), username, job from shift_employee left outer join employees on employee_id = employees.id order by day asc";
  try{
    const client = await pool.connect()
    const result = await client.query(query);
    const results = { 'results': (result) ? result.rows : null };
    console.log('connected to db to view shifts: ');
    res.render('pages/sphinxHome.ejs', results);
    client.release();
  } catch(err) {
    console.log(err);
    res.send("Error " + err);
  }
});

// employees
router.get('/employees', async (req, res) => {

  var query = "select id, username, wage, job, to_char(hire_date, 'Mon dd yyyy') from employees";
  try{
    const client = await pool.connect()
    const result = await client.query(query);
    const results = { 'results': (result) ? result.rows : null };
    console.log('connected to db to view employees');
    res.render('pages/employees', results);
    client.release();
  } catch(err) {
    console.log(err);
    res.send("Error " + err);
  }
});

// change shift
router.get('/changeShift', async (req, res) => {
  var query = "select id, username, wage, job, to_char(hire_date, 'Mon dd yyyy') from employees";
  try{
    const client = await pool.connect()
    const result = await client.query(query);
    const results = { 'results': (result) ? result.rows : null };
    console.log('Update sucessfull');
    res.send(results);
    client.release();
  } catch(err) {
    console.log(err);
    res.send("Error " + err);
  }
});

// edit shift
router.post('/editShift', (req, res) => {
  console.log(req.body.edit);
  console.log(req.body.del);
  var shifts = req.body;
  var shifts = shifts['shift[]'];
  console.log(shifts);

  // delete if delete is selected
  if(req.body.del){
    // if multiple deletes
    if(Array.isArray(shifts))
    for(var i = 0; i < shifts.length; i++){
      console.log(shifts[i]);
      deleteShift(shifts[i]);
    }
    // just one
    else(deleteShift(shifts));

    // refresh page
    res.redirect('/sphinxhome');
  }
  // if edit is selected go to the edit shift page
  else{
    console.log("get list of employees");
    getEmployeeList(function(empList){
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
      addEmployees(s, empID);
    });
  }
  else if(del){
    shifts.forEach(s => {
      delEmployees(s);
    });
  }
  res.redirect('/sphinxhome');
});

// add new shift
router.post('/newShift', async (req, res) => {
  console.log(req.body);
  var query = 'INSERT INTO shift_employee(shift, day) VALUES ($1, $2)';
  var params = [
    req.body.shift,
    req.body.day
  ]
  try{
    const client = await pool.connect()
    const result = await client.query(query, params);
    const results = { 'results': (result) ? result.rows : null };
    console.log('connected to db to add shift');
    res.redirect('/sphinxhome');
    client.release();
  } catch(err) {
    console.log(err);
    res.send("Error " + err);
  }
});

// add new employee
router.post('/addNew', async (req, res, next) => {
  console.log("ADD NEW WORKS!!");
  var query = "INSERT INTO employees(employer_id, username, wage, hire_date, job) VALUES($1,$2, $3, $4, $5)";
  console.log(req.body);
  var params = [
    1,
    req.body.name,
    req.body.wage,
    req.body.hireDate,
    req.body.position
  ]
  try{
    const client = await pool.connect()
    const result = await client.query(query, params);
    const results = { 'results': (result) ? result.rows : null };
    console.log('connected to db to add new employee');
    res.redirect('/employees');
    client.release();
  } catch(err) {
    console.log(err);
    res.send("Error " + err);
  }
});

// get employee details
router.get('/detail', (req, res) => {
  var id = req.query.id;
  var result = updateDB.getDetail(id);
  console.log(result);
  console.log("stupid async! " + id);
  res.render('partials/details.ejs');
})

// edit employee data
router.post('/changeEdata', (req, res) => {
  console.log(req.body);
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

/**********************************************
 * deletes the requested shift
 **********************************************/
async function deleteShift(i){
  console.log("deleting shift " + i);
  var query = 'DELETE FROM shift_employee where shift_id = $1';
  var params = [i];
  try{
    const client = await pool.connect()
    const result = await client.query(query, params);
    const results = { 'results': (result) ? result.rows : null };
    console.log('Removed shift ' + i);
    client.release();
  } catch(err) {
    console.log(err);
    res.send("Error " + err);
  }
}

/**********************************************
 * get employee list to edit shift
 **********************************************/
async function getEmployeeList(callback) {
  console.log("getting list");
  var query = "select id, username, job from employees";
  try{
    const client = await pool.connect()
    const result = await client.query(query);
    const results = { 'results': (result) ? result.rows : null };
    console.log("got list");
    callback(results);
    client.release();
  } catch(err) {
    console.log(err);
    res.send("Error " + err);
  }
}

/**********************************************
 * add selected employee to selected shift
 **********************************************/
async function addEmployees(shift, i){
  console.log("adding employee " + i + " to shift" + shift);
  var query = 'UPDATE shift_employee SET employee_id = $1 WHERE shift_id = $2;';
  var params = [i, shift];
  try{
    const client = await pool.connect()
    const result = await client.query(query, params);
    const results = { 'results': (result) ? result.rows : null };
    console.log("added employee " + i + " to shift " + shift);
    client.release();
  } catch(err) {
    console.log(err);
    res.send("Error " + err);
  }
}

/**********************************************
 * deletes selected employee from selected shift
 **********************************************/
async function delEmployees(shift){
  console.log("removing from shift" + shift);
  var query = 'UPDATE shift_employee SET employee_id = null WHERE shift_id = $1;';
  var params = [shift];
  try{
    const client = await pool.connect()
    const result = await client.query(query, params);
    const results = { 'results': (result) ? result.rows : null };
    console.log("removed from shift " + shift);
    client.release();
  } catch(err) {
    console.log(err);
    res.send("Error " + err);
  }
}