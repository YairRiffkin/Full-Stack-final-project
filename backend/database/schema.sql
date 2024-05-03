-- Main users table

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

-- Create actions history to manage status's

CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY NOT NULL,
    identifier TEXT NOT NULL,
    type TEXT,
    current TEXT,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    action TEXT,
    by TEXT,
    next TEXT
);

-- Make sure there is an admin in the data base to handle frontend issues

INSERT OR IGNORE INTO users 
(username, employee_id, email, location, phone_number, role, user_level, password)
VALUES 
('Yair Riffkin', 'E74323', 'yair.riffkin@xxx.com', 'Nahariya', '', 'Other', 'admin', 'Aa1234');
        