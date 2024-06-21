
from flask import json
from flask.testing import FlaskClient
from database.dbelements.dbfunctions import db_insert, db_set, db_fetchone
from models.users import User
from database.db import get_db
import pytest
from flask_jwt_extended import create_access_token, decode_token
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
    "password1": "",
    "password2": ""}


@pytest.fixture
def db():
    with app.app_context():
        db = get_db()
        db.execute("DELETE FROM users WHERE username LIKE 'Test %'")
        yield db
        db.execute("DELETE FROM users WHERE username LIKE 'Test %'")
        db.commit()


def test_user_update(db):
    client = app.test_client()

    new_user = User(*(user1.get(attr) if user1.get(attr) else None for attr in User.__annotations__))
    user_data = new_user.make_db_data("user", {"password": "Aa1234"})
    db_insert("users", user_data[0], [user_data[1]])
    user_id = db_fetchone("users", ["id"], ["employee_id"], [user1["employee_id"]])["id"]

    # Test update user, user updates his own details
    with app.app_context():
        userToken = create_access_token(identity=user_id)
    response = client.post("/users/update", headers={
        "Authorization": f"Bearer {userToken}",
        "Content-Type": "application/json"
        }, json=user1)
    assert response.status_code == 200, "User was not allowed to update his own data"

    # Test update user, trying to update other user
    with app.app_context():
        userToken = create_access_token(identity=(10))
    response = client.post("/users/update", headers={
        "Authorization": f"Bearer {userToken}",
        "Content-Type": "application/json"
        }, json=user1)
    assert response.status_code == 401, "User was allowed to update other user"

    # Test update user, invalid password update
    with app.app_context():
        userToken = create_access_token(identity=(user_id))
    user1["password1"] = "Bb1234"
    response = client.post("/users/update", headers={
        "Authorization": f"Bearer {userToken}",
        "Content-Type": "application/json"
        }, json=user1)
    assert response.status_code == 403, "User was allowed wrong password update"


def test_pending_users(db):
    client = app.test_client()

    new_user = User(*(user1.get(attr) if user1.get(attr) else None for attr in User.__annotations__))
    user_data = new_user.make_db_data("admin", {"password": "Aa1234"})
    db_insert("users", user_data[0], [user_data[1]])
    user_id = db_fetchone("users", ["id"], ["employee_id"], [user1["employee_id"]])["id"]

    # Test pending user list, admin access
    with app.app_context():
        userToken = create_access_token(identity=user_id)
    response = client.post("/users/pending", headers={
        "Authorization": f"Bearer {userToken}",
        "Content-Type": "application/json"
        })
    assert response.status_code == 200, "Admin was not allowed to fetch data"

    # Test pending user list, non admin access
    with app.app_context():
        userToken = create_access_token(identity=user_id+20)
    response = client.post("/users/pending", headers={
        "Authorization": f"Bearer {userToken}",
        "Content-Type": "application/json"
        })
    assert response.status_code == 401, "Non admin was allowed to fetch data"


def test_approve_users(db):
    client = app.test_client()

    new_user = User(*(user1.get(attr) if user1.get(attr) else None for attr in User.__annotations__))
    user_data = new_user.make_db_data("admin", {"password": "Aa1234"})
    db_insert("users", user_data[0], [user_data[1]])
    user_id = db_fetchone("users", ["id"], ["employee_id"], [user1["employee_id"]])["id"]
    body = {"ID": user_id, "User_level": "admin"}

    # Test pending user list, admin access
    with app.app_context():
        userToken = create_access_token(identity=user_id)
    response = client.post("/users/approve", headers={
        "Authorization": f"Bearer {userToken}",
        "Content-Type": "application/json"
        }, json=body)
    assert response.status_code == 200, "Admin was not allowed to approve"

    # Test pending user list, non admin access
    with app.app_context():
        userToken = create_access_token(identity=user_id+10)
    response = client.post("/users/approve", headers={
        "Authorization": f"Bearer {userToken}",
        "Content-Type": "application/json"
        }, json=body)
    assert response.status_code == 401, "Non admin was allowed to approve"
