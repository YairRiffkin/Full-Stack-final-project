import string
from database.db import get_db
import pytest
import phonenumbers as tel
from flask_jwt_extended import decode_token
from main import app
import random
from dbDemo import demo_users

user1 = {
    "username": "Dana Dana",
    "employee_id": "E99999",
    "email": "dana.dana@xxx.com",
    "phone_number": "0526088092",
    "location": "Nahariya",
    "role": "MRP Controller",
    "password1": "Aa1234",
    "password2": "Aa1234"}

user2 = {
    "username": "D D",
    "employee_id": "E74323",
    "email": "yair.riffkin@xxx.com",
    "phone_number": "0526088092",
    "location": "Nahariya",
    "role": "MRP Controller",
    "password1": "Aa1234",
    "password2": "Aa1234"}


passwords = {"password1": "Aa1234", "password2": "Aa1234"}
user2.update(passwords)


@pytest.fixture
def db():
    with app.app_context():
        db = get_db()
        db.execute("DELETE FROM users WHERE username LIKE 'test_%'")
        yield db
        db.execute("DELETE FROM users WHERE username LIKE 'test_%'")


def test_register(db):
    client = app.test_client()

    # Test registration, new user
    response = client.post("/users/new_user", json=user1)
    assert response.status_code == 200, "Registration failed"
    assert isinstance(response.json, dict)
    assert "userData" in response.json.keys(), "User details not in response for valid registration"
    user = response.json["userData"]
    phone = tel.parse(user1["phone_number"], "IL")
    phone = tel.format_number(phone, tel.PhoneNumberFormat.NATIONAL)
    assert user["username"] == user1["username"]
    assert user["email"] == user1["email"], "Email mismatch"
    assert user["phone_number"] == phone, "Phone number mismatch"
    assert user["location"] == user1["location"], "Location mismatch"
    assert user["role"] == user1["role"], "Role mismatch"
    assert "password" not in user.keys(), "Password returned in response"

    # Test registration, existing user
    response = client.post("/users/new_user", json=user2)
    assert response.status_code == 403, "Registration failed"
    response_json = response.json
    assert "error" in response_json, "error expected"
    assert "Duplicate" in response_json["error"], "Duplicate username not detected"
