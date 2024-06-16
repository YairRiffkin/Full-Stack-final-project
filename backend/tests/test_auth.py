import string
from database.dbelements.dbfunctions import db_insert
from models.users import User
from database.db import get_db
import pytest
import phonenumbers as tel
from flask_jwt_extended import decode_token
from main import app
import random

user1 = {
    "username": "Dana Dana",
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


@pytest.fixture
def db():
    with app.app_context():
        db = get_db()
        db.execute("DELETE FROM users WHERE username LIKE 'test_%'")
        user = User(*(user1.get(attr) if user1.get(attr) else None for attr in User.__annotations__))
        user_db_data = user.make_db_data("active", {"password": "Aa1234"})
        db_insert(
        "users",
        user_db_data[0],
        [user_db_data[1]]
        )

        yield db
        db.execute("DELETE FROM users WHERE username LIKE 'test_%'")


def test_login(db):
    client = app.test_client()
    db.execute("INSERT INTO users (employee_id, email, password) VALUES (?, ?, ?)", (user1["employee_id"], user1["email"], user1["password"]))

    # Test plain password
    response = client.post("/login", json={"username": user1["employee_id"], "password": user1["password"]})
    assert response.status_code == 200, "Valid login failed (plain password)"
    assert isinstance(response.json, dict)
    assert "access_token" in response.json.keys(), "Token not in response for valid login (plain password)"