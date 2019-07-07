
exports.getDetail = getDetail;

var local = 'postgres://@localhost/project_njs'; // for local access
var heroku = process.env.DATABASE_URL;

// db connection
const { Pool } = require('pg')
const pool = new Pool({
  connectionString: local,
  ssl: false
});

function changeShift(employeeId){

}

function getDetail(query) {
  console.log("it works in the query module: " + query);
  var query = "select * from employees";
  return makeQuery(query);
}

async function makeQuery(queryString) {
  try{
    const client = await pool.connect()
    const result = await client.query(queryString);
    const results = { 'results': (result) ? result.rows : null };
    console.log('connected to db');
    client.release();
    return results;
  } catch(err) {
    console.log(err);
    return err;
  }
}