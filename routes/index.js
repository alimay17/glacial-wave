var express = require('express');
var router = express.Router();
var pg = require('pg');
var conString = 'postgres://@localhost/project_njs'; // for local access

const { Pool } = require('pg')
const pool = new Pool({
  connectionString: conString,
  ssl: false
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/index');
});

// get db
router.get('/db', async (req, res) => {
  try{
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM employees');
    const results = { 'results': (result) ? result.rows : null };
    console.log('connected to db');
    res.render('pages/db', results);
    client.release();
  } catch(err) {
    console.log(err);
    res.send("Error " + err);
  }
})

// get rates
router.get('/getRate', function(req, res){
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
})

module.exports = router;
