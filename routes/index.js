var express = require('express');
var router = express.Router();
var pg = require('pg');
var conString = 'postgres://@localhost/project_njs'; // for local access

const { Pool } = require('pg')
const pool = new Pool({
  connectionString: conString,
  ssl: false
});

/* GET assignments home. */
router.get('/', (req, res, next) => {
  res.render('pages/index');
});

// splash page
router.get('/sphinxmanager', (req, res, next) => {
  res.render('pages/splash.ejs');
});

// login
router.post('/login', (req, res, next) => {
  res.redirect('/sphinxhome');
});

// employer home
router.get('/sphinxhome', async (req, res) => {
  try{
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM employees');
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
router.get('/employees', (req, res) => {
  res.render('pages/employees');
})

// get rates
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