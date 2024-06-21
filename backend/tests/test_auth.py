import string
from database.dbelements.dbfunctions import db_insert
from models.users import User
from database.db import get_db
import pytest
from flask_jwt_extended import decode_token
from main import app
import random

app.config["SECRET_KEY"] = "testkey"
app.config["TEST"] = "testing"

user1 = {
    "username": "Test Dana",
    "employee_id": "E99999",
    "email": "dana.dana@xxx.com",
    "phone_number": "0526088092",
    "location": "Nahariya",
    "role": "MRP Controller",
    "password": "Aa1234"}


def generate_password():
    while True:
        password = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(6))
        if any(c.islower() for c in password) and any(c.isupper() for c in password) and any(c.isdigit() for c in password):
            return password


user2 = {
    "username": "Test Moshe",
    "employee_id": "E88888",
    "email": "moshe.moshe@xxx.com",
    "phone_number": "0526088092",
    "location": "Nahariya",
    "role": "MRP Controller",
    "password": generate_password()}


@pytest.fixture
def db():
    with app.app_context():
        db = get_db()
        db.execute("DELETE FROM users WHERE username LIKE 'Test %'")
        yield db
        db.execute("DELETE FROM users WHERE username LIKE 'Test %'")
        db.commit()


def test_login(db):
    client = app.test_client()
    db.execute("INSERT INTO users (username, employee_id, email, phone_number, location, role, password) VALUES (?, ?, ?, ?, ?, ?, ?)",
               (user1["username"], user1["employee_id"], user1["email"], user1["phone_number"], user1["location"], user1["role"], user1["password"]))
    db.execute("INSERT INTO users (username, employee_id, email, phone_number, location, role, password) VALUES (?, ?, ?, ?, ?, ?, ?)",
               (user2["username"], user2["employee_id"], user2["email"], user2["phone_number"], user2["location"], user2["role"], user2["password"]))

    # Test plain password
    response = client.post("/login", json={"username": user1["employee_id"], "password": user1["password"]})
    assert response.status_code == 200, "Valid login failed (plain password)"
    assert isinstance(response.json, dict)
    assert "access_token" in response.json.keys(), "Token not in response for valid login (plain password)"

    # Test generated password
    response = client.post("/login", json={"username": user2["employee_id"], "password": user2["password"]})
    assert response.status_code == 200, "Valid login failed (generated password)"
    assert isinstance(response.json, dict)
    assert "access_token" in response.json.keys(), "Token not in response for valid login (plain password)"

    # Test email username
    response = client.post("/login", json={"username": user1["email"], "password": user1["password"]})
    assert response.status_code == 200, "Valid login failed (email as username)"
    assert isinstance(response.json, dict)
    assert "access_token" in response.json.keys(), "Token not in response for valid login (plain password)"

    # Test wrong username
    response = client.post("/login", json={"username": "F12345", "password": user1["password"]})
    assert response.status_code == 503, "Wrong username was accepted"
    assert isinstance(response.json, dict)
    assert "error" in response.json.keys(), "Error not in response for wrong user name"

    # Test wrong password
    response = client.post("/login", json={"username": user1["employee_id"], "password": "123456"})
    assert response.status_code == 503, "Wrong password was accepted"
    assert isinstance(response.json, dict)
    assert "error" in response.json.keys(), "Error not in response for wrong password"
