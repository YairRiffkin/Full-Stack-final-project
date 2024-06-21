
from database.db import get_db
import pytest
import phonenumbers as tel
from main import app

app.config["SECRET_KEY"] = "testkey"
app.config["TEST"] = "testing"

user1 = {
    "username": "Test Dana",
    "employee_id": "E99999",
    "email": "dana.dana@xxx.com",
    "phone_number": "0526088092",
    "location": "Nahariya",
    "role": "MRP Controller",
    "password1": "Aa1234",
    "password2": "Aa1234"}

user2 = {
    "username": "Test D",
    "employee_id": "E74323",
    "email": "yair.riffkin@xxx.com",
    "phone_number": "0526088092",
    "location": "Nahariya",
    "role": "MRP Controller",
    "password1": "Aa1234",
    "password2": "Aa1234"}


@pytest.fixture
def db():
    with app.app_context():
        db = get_db()
        db.execute("DELETE FROM users WHERE username LIKE 'Test %'")
        yield db
        db.execute("DELETE FROM users WHERE username LIKE 'Test %'")
        db.commit()


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
    assert response.status_code == 403, "Registration was approved"
    response_json = response.json
    assert "error" in response_json, "error expected"
    assert "Duplicate" in response_json["error"], "Duplicate username not detected"

    # Test registration, wrong user name input
    user1["username"] = "Test Dana "
    response = client.post("/users/new_user", json=user1)
    assert response.status_code == 403, "Registration was approved"
    response_json = response.json
    assert "error" in response_json, "error expected"
    assert "Name" in response_json["error"], "Lagging space not detected"

    user1["username"] = "Test Dana1 "
    response = client.post("/users/new_user", json=user1)
    assert response.status_code == 403, "Registration was approved"
    response_json = response.json
    assert "error" in response_json, "error expected"
    assert "Name" in response_json["error"], "Digit in name not detected"

    # Test registration, wrong employee ID input
    user1["employee_id"] = "123456"
    response = client.post("/users/new_user", json=user1)
    assert response.status_code == 403, "Registration was approved"
    response_json = response.json
    assert "error" in response_json, "error expected"
    assert "Employee ID" in response_json["error"], "Missing letter not detected"

    user1["employee_id"] = "F12345"
    response = client.post("/users/new_user", json=user1)
    assert response.status_code == 403, "Registration was approved"
    response_json = response.json
    assert "error" in response_json, "error expected"
    assert "Employee ID" in response_json["error"], "Missing E/T not detected"

    # Test registration, wrong email input
    user1["email"] = "d.d@gmail.com "
    response = client.post("/users/new_user", json=user1)
    assert response.status_code == 403, "Registration was approved"
    response_json = response.json
    assert "error" in response_json, "error expected"
    assert "Email" in response_json["error"], "Missing xxx.com not detected"

    user1["email"] = "test.dana.xxx.com"
    response = client.post("/users/new_user", json=user1)
    assert response.status_code == 403, "Registration was approved"
    response_json = response.json
    assert "error" in response_json, "error expected"
    assert "Email" in response_json["error"], "Missing @ not detected"

    # Test registration, wrong phone number input
    user1["phone_number"] = "123456 "
    response = client.post("/users/new_user", json=user1)
    assert response.status_code == 403, "Registration was approved"
    response_json = response.json
    assert "error" in response_json, "error expected"
    assert "Phone number" in response_json["error"], "Invalid number not detected"

    user1["phone_number"] = "0921234567"
    response = client.post("/users/new_user", json=user1)
    assert response.status_code == 403, "Registration was approved"
    response_json = response.json
    assert "error" in response_json, "error expected"
    assert "Phone number" in response_json["error"], "Impossible number not detected"

    # Test registration, location or role input
    user1["location"] = "Haifa "
    response = client.post("/users/new_user", json=user1)
    assert response.status_code == 403, "Registration was approved"
    response_json = response.json
    assert "error" in response_json, "error expected"
    assert "Location" in response_json["error"], "Invalid location not detected"

    user1["role"] = "Funny"
    response = client.post("/users/new_user", json=user1)
    assert response.status_code == 403, "Registration was approved"
    response_json = response.json
    assert "error" in response_json, "error expected"
    assert "Role" in response_json["error"], "Invalid role not detected"
