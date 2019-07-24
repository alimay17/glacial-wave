/*******************************************************
 * This module exports all the access database functions 
 * for the sphinx manager web app
 ***************************************************/
exports.deleteShift = deleteShift;
exports.getEmployeeList = getEmployeeList;
exports.addEmployees = addEmployees;
exports.removeEmp = removeEmp;
exports.removeEmpAll = removeEmpAll;
exports.deleteEmp = deleteEmp;
exports.getSchedule = getSchedule;
exports.employeeManage = employeeManage;
exports.newShift = newShift;
exports.newEmployee = newEmployee;

// db connection
var heroku = process.env.DATABASE_URL;
const { Pool } = require('pg')
const pool = new Pool({
  connectionString: heroku,
  ssl: true
});

/**********************************************
 * Gets full schedule for home page
 **********************************************/
async function getSchedule(callback){
  var query = "select shift_id, shift, to_char(day, 'Mon dd yyyy'), username, job from shift_employee left outer join employees on employee_id = employees.id order by day asc";
  try{
    const client = await pool.connect()
    const result = await client.query(query);
    const results = { 'results': (result) ? result.rows : null };
    console.log('connected to db to view shifts: ');
    callback(results);
    client.release();
  } catch(err) {
    console.log(err);
    res.send("Error " + err);
  }
}

/**********************************************
 * Add a new shift
 **********************************************/
async function newShift(params, callback){
  var query = 'INSERT INTO shift_employee(shift, day) VALUES ($1, $2)';
  try{
    const client = await pool.connect()
    const result = await client.query(query, params);
    const results = { 'results': (result) ? result.rows : null };
    console.log('Added new shift');
    callback();
    client.release();
  } catch(err) {
    console.log(err);
    res.send("Error " + err);
  }
}

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
async function removeEmp(shift){
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

/**********************************************
 * deletes selected employee from all shifts
 **********************************************/
async function removeEmpAll(id, callback){
  console.log("removing from shifts");
  var query = 'UPDATE shift_employee SET employee_id = null WHERE employee_id = $1;';
  var params = [id];
  try{
    const client = await pool.connect()
    const result = await client.query(query, params);
    const results = { 'results': (result) ? result.rows : null };
    console.log("removed from all shifts");
    callback();
    client.release();
  } catch(err) {
    console.log(err);
    res.send("Error " + err);
  }
}

/**********************************************
 * get employee list to edit shift
 **********************************************/
async function employeeManage(callback) {
  console.log("getting list");
  var query = "select id, username, wage, job, to_char(hire_date, 'Mon dd yyyy') from employees";
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
 * Add a new Employee
 **********************************************/
async function newEmployee(params, callback) {
  var query = "INSERT INTO employees(employer_id, username, wage, hire_date, job) VALUES($1,$2, $3, $4, $5)";
  try{
    const client = await pool.connect()
    const result = await client.query(query, params);
    const results = { 'results': (result) ? result.rows : null };
    console.log("got list");
    callback();
    client.release();
  } catch(err) {
    console.log(err);
    res.send("Error " + err);
  }
}

/**********************************************
 * deletes selected employee from database
 **********************************************/
async function deleteEmp(i){
  console.log("deleting emp " + i);
  var query = 'DELETE FROM employees WHERE id = $1';
  var params = [i];

  console.log("checking if employee is assigned a shift");
    removeEmpAll(i, async function(){
      try{
        const client = await pool.connect()
        const result = await client.query(query, params);
        const results = { 'results': (result) ? result.rows : null };
        console.log("deleted emp " + i);
        client.release();
      } catch(err) {
        console.log(err);
        res.send("Error " + err);
      }
  });
}