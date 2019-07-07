var express = require('express');
var router = express.Router();
var pg = require('pg');
var updateDB = require('../myModules/accessDB.js');
var local = 'postgres://@localhost/project_njs'; // for local access
var heroku = process.env.DATABASE_URL;

// db connection
const { Pool } = require('pg')
const pool = new Pool({
  connectionString: heroku,
  ssl: false
});

/* GET assignments home. */
router.get('/', (req, res, next) => {
  res.render('pages/index');
});

// splash page for sphinx Manager
router.get('/sphinxmanager', (req, res, next) => {
  res.render('pages/splash.ejs');
});

// login
router.post('/login', (req, res, next) => {
  res.redirect('/sphinxhome');
});

// employer home
router.get('/sphinxhome', async (req, res) => {
  var display = "select shift, to_char(day, 'Mon dd'), username, job from shift_employee join employees on employee_id = employees.id order by day asc";
  try{
    const client = await pool.connect()
    const result = await client.query(display);
    const results = { 'results': (result) ? result.rows : null };
    console.log('connected to db');
    res.render('pages/sphinxHome.ejs', results);
    client.release();
  } catch(err) {
    console.log(err);
    res.send("Error " + err);
  }
});

// employees
router.get('/employees', async (req, res) => {

  var display = "select id, username, wage, job, to_char(hire_date, 'Mon dd yyyy') from employees";
  try{
    const client = await pool.connect()
    const result = await client.query(display);
    const results = { 'results': (result) ? result.rows : null };
    console.log('connected to db');
    res.render('pages/employees', results);
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

// change shift
router.get('/changeShift', async (req, res) => {
  var some = "update shift_employee set shift = 'pm' where employee_id = 1";
  try{
    const client = await pool.connect()
    const result = await client.query(some);
    console.log('Update sucessfull');
    client.release();
  } catch(err) {
    console.log(err);
    res.send("Error " + err);
  }
  res.redirect('/sphinxhome');
});

// add new employee
router.post('/addNew', async (req, res) => {
  console.log("ADD NEW WORKS!!");
  var query = "INSERT INTO employees(employer_id, username, wage, hire_date, job) VALUES($1,$2, $3, $4, 5)";
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
    console.log('connected to db');
    res.redirect('/employees');
    client.release();
  } catch(err) {
    console.log(err);
    res.send("Error " + err);
  }
});

// get rates from previous assignment. 
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