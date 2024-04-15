CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY NOT NULL,
    username TEXT NOT NULL,
    employee_id TEXT UNIQUE,
    email TEXT UNIQUE,
    location TEXT,
    phone_number TEXT,
    role TEXT,
    user_level TEXT NOT NULL DEFAULT 'user',
    password TEXT NOT NULL
);
INSERT INTO users (username, employee_id, email, location, 
                    phone_number, role, user_level, password)
VALUES  ('yair', 'E1234', 'admin@xxx.com', 'nahariya', '', 'manager', 'admin', '1234'),
        ('moshe', 'E2345', 'user@xxx.com', 'afula', '', 'controller', 'user', '2345'),
        ('tom', 'E3456', 'procn@xxx.com', 'tzrifin', '', 'buyer', 'proc', '3456'),
        ('guest', 'E4567', 'guest@xxx.com', 'hadera', '', 'operator', 'guest', '4567');
        