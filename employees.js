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

var role;
var manager;
var managerId;
var first;
var last;

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
            console.log(err);
        }
       else console.table(res);
    });
    connection.end();
}

function EmployeeByManagers(){
    var thisManager = 'Employee First Name';
    connection.query(`SELECT m.first_name EmployeeFirstName, m.last_name EmployeeLastName,
                            e.first_name ManagerFirstName, e.last_name ManagerLastName
                    FROM employee e
                    INNER JOIN employee m ON m.manager_id = e.emp_id`, function(err, res){
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
        },
        {
            type: "input",
            message: "Manger's last name. Leave blank if not applicable",
            name:"managerName"
        }
    ]).then(function(res){
        manager = res.managerName;
        first = res.firstName;
        last = res.lastName;
        connection.query("SELECT r_id FROM role WHERE ?",{title: res.role}, function(err, data){
            if (err) console.log(err);
            else role = data[0].r_id;
        });
    }).then(function(){
        connection.query(`SELECT emp_id FROM employee WHERE ?`,{last_name: manager}, function(err, data){
            if (err) console.log(err);
            else managerId = data[0].emp_id;
            addEmp();
        });
    })
};

function addEmp(){

    connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", 
    [first, last, role, managerId],
    function(err){
        if (err) throw err;
        else {
            console.log("successfully added employee!");
            userPrompt();
    }
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
            if (err){
                console.log(err);
            }
            else userPrompt();
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