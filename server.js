const mysql = require('mysql2');
const inquirer = require('inquirer')
const table = require('console.table')

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'employess_db'
    },
    console.log(`Connected to the employee_db database.`)
);

db.query('SELECT * FROM employees_db', function (err, results) {
    console.log(results);
});
  

const mainMenu = () => {
    inquirer.prompt([
        {
            type: "list",
            name: "selection",
            message: "Please select an option from the list",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",
                "Quit"
            ],
            },
    ])
    .then(function (data){
        switch(data.selection){
            case "View all departments":
                viewAllDepartments();
                break;
            case "View all roles":
                viewAllRoles();
                break;
            case "View all employees":
                viewAllEmployees();
                break;
            case "Add a department":
                AddADepartment();
                break;
            case "Add a role":
                AddARole();
                break;
            case "Add an employee":
                AddAnEmployee();
                break;
            case "Update an employee role":
                UpdateAnEmployee();
                break;
            case "Quit":
                db.end();
                break;
        }
    })
}

const viewAllDepartments = () => {
    db.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        console.table(results);
        mainMenu();
    });
}

const viewAllRoles = () => {
    db.query('SELECT roles.id, roles.title, department.department_name AS department FROM roles INNER JOIN department ON roles.department_id = department.id', (err, results) => {
        if (err) throw err;
        console.table(results);
        mainMenu();
    });
}

const viewAllEmployees = () => {
    db.query('SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.department_name AS department, roles.salary FROM employee, roles, department WHERE department.id = roles.department_id AND roles.id = employee.roles_id ORDER BY employee.id ASC', (err, results) => {
        if (err) throw err;
        console.table(results);
        mainMenu();
    });
}

const AddADepartment = () => {
    inquirer.prompt([
        {
            name:"department",
            type: "input",
            message: "What department would you like to add?",
        }
    ]).then((data) => {
        db.query(`INSERT INTO department (department_name) VALUES ('${data.department}')`, (err, result) => {
            if (err) throw err;
            console.log(`${data.department} added to departments`);
        });
        mainMenu();
    });
}

const AddARole = () => { 
    let departments = [];

    db.query('SELECT * FROM department', (err, result) => {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            departments.push(result[i].department_name)
        } return departments
    });

    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "What role's title would you like to add?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary for this role?",
            validate: number => {
                if (isNaN(number)) {
                    console.log('Please enter a salary');
                    return false;
                } else {
                    return true;
                }
            }
        },
        {
            name: 'roleDepartment',
            type: 'list',
            message: 'Please select one of the departments below',
            choices: departments,
        }
    ])
        .then((data) => {
            let departmentID = departments.indexOf(data.roleDepartment) +1;

            db.query(`INSERT INTO roles (title, salary, department_id) VALUES('${data.title}', '${data.salary}', '${departmentID}')`, (err, result) => {
                if (err) throw err;
                    console.log('Successfully added new role to Comapny Database');
        });
        mainMenu();
    });
}


const AddAnEmployee = () => {
    let roles = [];
    let managers = ['Not Applicable']; 

    db.query('SELECT * FROM roles', (err, result) => {
        if (err) throw err;
        for(let i = 0; i < result.length; i++) {
        roles.push(result[i].title)
        } return roles;
    });

    db.query('SELECT * FROM employee', (err, result) => {
        if (err) throw err;
        for(let i = 0; i < result.length; i++) {
        managers.push(result[i].first_name)
        } return managers
    });
    
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstname',
            message: "What is employee's first name?"
        },
        {
            type: 'input',
            name: 'lastname',
            message: "What is employee's last name?"
        },
        {
            type: 'list',
            name: 'employeeRole',
            message: "Please select employee's role",
            choices: roles,
        },
        {
            type: 'list',
            name: 'employeeManager',
            message: "Please select employee's manager",
            choices: managers,
        }
               
    ])
    .then ((data) => {
        let roleID = roles.indexOf(data.employeeRole) +1;
        let managerID = managers.indexOf(data.employeeManager) + 1;
        
        if (data.employeeManager === 'Not Applicable') {
                    db.query(`INSERT INTO employee (first_name, Last_name, roles_id) VALUES('${data.firstname}', '${data.lastname}', '${roleID}')`, (err, result) => {
                    if (err) throw err;
                    console.log('New employee successfully added.');
                    main();
                });                
            } 
            else {
                db.query(`INSERT INTO employee (first_name, Last_name, roles_id, manager_id) VALUES('${data.firstname}', '${data.lastname}', '${roleID}', '${managerID}')`, (err, result) => {
                if (err) throw err;
                console.log('New employee successfully added');
                mainMenu();
                });
            }
    });
};

const UpdateAnEmployee = () =>  {
    db.query('SELECT * FROM employee', function (err, results) {
        if (err) throw err;
        inquirer
        .prompt([{
            name: 'employeeUpdate',
            type: 'list',
            message: "Please select employee to update their role",
            choices: results.map(employee => employee.first_name)
        },
    ])
    .then((answer) => {
        const updateEmployee = results.find(employee => employee.first_name === answer.employeeUpdate)
        db.query('SELECT * FROM roles', function (err, results) {
            if (err) throw err;
            inquirer
            .prompt([
                {
                    name: 'role_id',
                    type: 'list',
                    message: "Please select role to be update",
                    choices: results.map(roles => roles.title)
                },
            ])
            
                .then((answer) => {
                   
                    const roleChosen = results.find(roles => roles.title === answer.role_id)
                   
                    db.query(`UPDATE employee SET roles_id = ${roleChosen.id} WHERE id = ${updateEmployee.id}`, (err, result) => {
                            if (err) throw err;
                            console.log("Employee's role successfully updated");
                            mainMenu();
                        }
                    )
                })
            })
        })
    })
}
mainMenu()