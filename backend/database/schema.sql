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
    next TEXT,
    relative INTEGER
);

CREATE TABLE IF NOT EXISTS itemsbasic (
    id INTEGER PRIMARY KEY NOT NULL,
    SKU INTEGER UNIQUE,
    short_hebrew TEXT NOT NULL,
    long_hebrew TEXT NOT NULL,
    mat_type TEXT NOT NULL,
    unit_of_measure TEXT NOT NULL,
    old_number TEXT NOT NULL,
    mat_group TEXT NOT NULL,
    net_weight TEXT NOT NULL,
    order_unit TEXT NOT NULL,
    purch_group TEXT NOT NULL,
    manufacturer_num TEXT NOT NULL,
    man_part_num TEXT NOT NULL,
    plant TEXT NOT NULL,
    stor_loc TEXT NOT NULL,
    bin TEXT NOT NULL,
    profit_center TEXT NOT NULL,
    mrp_type TEXT NOT NULL,
    reorder_pnt TEXT NOT NULL,
    controller TEXT NOT NULL,
    max_stock TEXT NOT NULL,
    delivery_time TEXT NOT NULL,
    short_english TEXT NOT NULL,
    long_english TEXT NOT NULL,
    supplier_num TEXT NOT NULL,
    sup_name TEXT NOT NULL,
    std_price TEXT NOT NULL,
    currency TEXT NOT NULL,
    sup_part_num TEXT NOT NULL,
    quote_num TEXT NOT NULL,
    quote_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
);

-- Make sure there is an admin in the data base to handle frontend issues

INSERT OR IGNORE INTO users 
(username, employee_id, email, location, phone_number, role, user_level, password)
VALUES 
('Yair Riffkin', 'E74323', 'yair.riffkin@xxx.com', 'Nahariya', '', 'Other', 'admin', 'Aa1234');
        