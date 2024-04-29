CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY NOT NULL,
    username TEXT NOT NULL,
    employee_id TEXT UNIQUE,
    email TEXT UNIQUE,
    phone_number TEXT,
    location TEXT,
    role TEXT,
    password TEXT NOT NULL,
    user_level TEXT NOT NULL DEFAULT 'pending'
);
INSERT INTO users (username, employee_id, email, location, 
                    phone_number, role, user_level, password)
VALUES  ('yair', 'E12345', 'admin@xxx.com', 'nahariya', '', 'manager', 'admin', '1234'),
        ('moshe', 'E23456', 'user@xxx.com', 'afula', '', 'controller', 'user', '2345'),
        ('tom', 'E34567', 'procn@xxx.com', 'tzrifin', '', 'buyer', 'proc', '3456'),
        ('guest', 'E45678', 'guest@xxx.com', 'hadera', '', 'operator', 'guest', '4567');
        