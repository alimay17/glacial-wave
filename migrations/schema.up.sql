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
  password varchar(60),
  CONSTRAINT employeer_pkey PRIMARY KEY (id)
);

CREATE TABLE schedule_employee (
  
)
/*
CREATE TABLE posts (
  id serial primary key,
  user_id integer references users(id) on delete cascade,
  content varchar(200)
);
*/