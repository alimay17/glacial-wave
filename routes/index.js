var express = require('express');
var router = express.Router();
const { Pool } = require('pg')
const Pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/index');
});

// get db
router.get('/db', async (req, res) => {
  try{
    const client = await Pool.connect()
    const result = await client.query('SELECT * FROM test_table');
    const results = { 'results': (result) ? result.rows : null };
    res.render('pages/db', results);
    client.release();
  } catch(err) {
    console.log(err);
    res.send("Error " + err);
  }
})


module.exports = router;
