DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;

USE employee_tracker_db;

CREATE TABLE department (
    dep_id INT auto_increment NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY(dep_id)
);

CREATE TABLE role (
    r_id INT auto_increment NOT NULL,
    department_id INT,
    title VARCHAR(30), 
    salary DECIMAL(65,3),
    PRIMARY KEY(r_id),
    Foreign key (department_id) references department(dep_id)
);

CREATE TABLE employee (
    emp_id INT auto_increment NOT NULL,
    role_id INT,
    manager_id INT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    PRIMARY KEY(emp_id),
    FOREIGN KEY (role_id) REFERENCES role(r_id),
    FOREIGN KEY (manager_id) REFERENCES employee(emp_id)
);


SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;