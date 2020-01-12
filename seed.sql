DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;

USE employee_tracker_db;

CREATE TABLE department (
    id INT auto_increment NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY(id)
);

CREATE TABLE role (
    id INT auto_increment NOT NULL,
    department_id INT,
    title VARCHAR(30), 
    salary DECIMAL(65,3),
    PRIMARY KEY(id),
    Foreign key (department_id) references department(id)
);

CREATE TABLE employee (
    id INT auto_increment NOT NULL,
    role_id INT,
    manager_id INT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    PRIMARY KEY(id),
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO department (name)
VALUES ('tech');

INSERT INTO role (title, salary)
VALUES ('junior software engineer', 80.000);

INSERT INTO employee (first_name, last_name)
VALUES ('adam', 'sanchez');

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;