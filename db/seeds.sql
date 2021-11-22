INSERT INTO department (department_name)
VALUES  ("Sales"),
        ("IT"),
        ("Accounts");

INSERT INTO roles (title, salary, department_id)
VALUES  ("Sales Manager", 90000, 1),
        ("Salesperson", 60000, 1),
        ("Salesperson", 60000, 1),
        ("Ingenieer Manager", 180000, 2),
        ("Senior Ingenieer", 110000, 2),
        ("Junior Ingenieer", 70000, 2),
        ("Accountant Manager", 85000, 3),
        ("Accountant", 65000, 3);

INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES  ("Dorian", "Yates", 1, NULL),
        ("Chris", "Froome", 2, 1),
        ("Kate", "Moore", 3, 1),
        ("Evelyn", "Scott", 4, NULL),
        ("Benjamin", "Nelson", 5, 4),
        ("Isabella", "Hill", 6, 4),
        ("William", "Martin", 7, NULL),
        ("Emma", "Jones", 8, 7);
        