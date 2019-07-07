CREATE TABLE employees (
  id serial primary key,
  username varchar(60),
  password varchar(60),
  em_data varchar,
  employer_id integer,
  CONSTRAINT employer_id FOREIGN KEY (employer_id)
    REFERENCES employer (id) MATCH SIMPLE
);

CREATE TABLE employer (
  id serial primary key,
  username varchar(60),
  password varchar(60)
);

CREATE TABLE shift_employee (
 id serial primary key,
 shift varchar(32),
 employee_id integer,
 CONSTRAINT employee_id FOREIGN KEY (employee_id)
  REFERENCES employees (id) MATCH SIMPLE 
);

CREATE TABLE shift {

}
/*
CREATE TABLE posts (
  id serial primary key,
  user_id integer references users(id) on delete cascade,
  content varchar(200)
);
*/