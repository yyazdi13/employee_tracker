var mysql = require('mysql');
var inquirer = require('inquirer');
var cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_tracker_db"
});

connection.connect(function(err){
    if (err) throw err;
    console.log('connected as id ' + connection.threadId + "\n");
    userPrompt();
});

function userPrompt(){
    inquirer.prompt([
        {
            type: "list",
            name: "start",
            message: "what would you like to do?",
            choices: ["view all employees", "view all employees by manager","add employee", 
            "update employee", "remove employee", "add department"]
        }
    ]).then(function(res){
        if (res.start === "view all employees"){
            allEmployees();
        }
        else if (res.start === "view all employees by manager"){
            EmployeeByManagers();
        }
        else if (res.start === "add employee"){
            addEmployee();
        }
        else if (res.start === "update employee"){
            updateEmployee();
        }
        else if (res.start === "remove employee"){
            removeEmployee();
        }
        else if (res.start === "add department"){
            addDepartment();
        }
        
    });
};

function allEmployees(){
    connection.query("SELECT * FROM employee", function(err, res){
        if (err){
            console.log(err)
        }
        console.table(res)
    });
};

function EmployeeByManagers(){
    connection.query(`SELECT e.first_name employeeFirst, e.last_name employeeLast,
                            m.first_name managerFirst, m.last_name managerLast
                    FROM employee e
                    LEFT JOIN employee m ON m.manager_id = e.emp_id`, function(err, res){
        if (err){
            console.log(err);
        }
        console.table(res);
    })
};

function addEmployee(){
    inquirer.prompt([
        {
            type: "input",
            message: "role title?",
            name: "role"
        },
        {
            type: "input",
            message: "first name?",
            name: "firstName" 
        },
        {
            type: "input",
            message: "last name?",
            name: "lastName"
        }
    ]).then(function(res){

        connection.query("SELECT r_id, title FROM employee INNER JOIN role ON role_id = r_id", function(err, data){
            if (err) throw err; 
            // console.log(res.role);
            for (let i =0; i < data.length; i++){
                if(res.role === data[i].title){
                    var role = data[i].r_id;
                }
            }
            addEmp(role,res);
        })
    })
};

// function findDepartment(role,res){
//     connection.query("SELECT r_id, name, department_id FROM role INNER JOIN department ON department_id = dep_id WHERE ?",
//     {
//         r_id: role
//     },
//     function(err,data){
//         if (err) throw err;
//         console.log(data[0].department_id)
//         addEmp(role,res);
//     })
// }

function addEmp(role,res){

    connection.query("INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)", 
    [res.firstName, res.lastName, role],
    function(err){
        if (err) throw err;
        console.log("successfully added employee!")
    });
};

function updateEmployee(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'first',
            message: "first name of the employee you wish to update?"
        },
        {
            type: "input",
            name: 'last',
            message: "last name of the employee you wish to update?"
        },
        {
            type: 'input',
            name: 'firstChange',
            message: "what would you like to change the first name to?"
        },
        {
            type: "input",
            name: 'lastChange',
            message: "what would you like to change the last name to?"
        }
    ]).then(function(response){
        connection.query('UPDATE employee SET ? WHERE ? ', 
        [
            {
                first_name: response.firstChange
            },
            {
                last_name: response.last
            }
        ],
        function (err){
            if (err){console.log(err)}
        }
        )
        connection.query("UPDATE employee SET ? WHERE ?", [
            {
                last_name: response.lastChange
            },
            {
                first_name: response.first
            }
        ], function(err){
            if (err){console.log(err);}
        });
    });
};

function removeEmployee(){
    inquirer.prompt([
        {
            type: "input",
            message: "employee first name?",
            name: "first_name"
        },
        {
            type: "input",
            message: "employee last name?",
            name: "last_name"
        }
    ]).then(function(response){
        var first = JSON.stringify(response.first_name);
        var last = JSON.stringify(response.last_name);
        connection.query(`DELETE FROM employee WHERE first_name = ${first} AND last_name = ${last}`,function (err){
            if (err) {console.log(err);}
            console.log("successfully removed");
            connection.end();
        })
    })
};

function addDepartment(){
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "department name?"
        }
    ]).then(function(response){

    connection.query("INSERT INTO department SET ?",
    {
        name: JSON.stringify(response.department)
    },
    function(err){
        if (err){
            console.log(err)
        }
        console.log("you added a department")
    })
    });
}