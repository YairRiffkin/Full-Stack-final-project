
from flask_jwt_extended import create_access_token
from models.users import User
from models.items import Item
from views.users import new_user
from database.db import get_db
from elements.DemoElements import demo_items
import pytest
from database.dbelements.dbfunctions import db_fetchone, db_insert
from main import app

app.config["SECRET_KEY"] = "testkey"
app.config["TEST"] = "testing"

user1 = {
    "username": "Test Dana",
    "employee_id": "E99999",
    "email": "dana.dana@xxx.com",
    "phone_number": "0526088092",
    "location": "Nahariya",
    "role": "MRP Controller"}

user2 = {
    "username": "Test Moshe",
    "employee_id": "E88888",
    "email": "moshe.moshe@xxx.com",
    "phone_number": "0526088092",
    "location": "Nahariya",
    "role": "MRP Controller"}

item1 = demo_items[10]
item1["shortHebrewDescription"] = "Test item"
item1["plant"] = "4631"
item1["profitCenter"] = "B27912"
item1["manufacturerPartNumber"] = "00000"

item2 = demo_items[15]
item2["shortHebrewDescription"] = "Test item"
item2["plant"] = "4631"
item2["profitCenter"] = "B27912"
item2["manufacturerPartNumber"] = "00001"


@pytest.fixture
def db():
    with app.app_context():
        db = get_db()
        db.execute("DELETE FROM users WHERE username LIKE 'Test %'")
        db.execute("DELETE FROM itemsbasic WHERE short_hebrew LIKE 'Test %'")
        yield db
        db.execute("DELETE FROM users WHERE username LIKE 'Test %'")
        db.execute("DELETE FROM itemsbasic WHERE short_hebrew LIKE 'Test %'")
        db.commit()


def test_new_item(db):
    client = app.test_client()

    user = User(*(user1.get(attr) if user1.get(attr) else None for attr in User.__annotations__))
    user_data = user.make_db_data("user", {"password": "Aa1234"})
    db_insert("users", user_data[0], [user_data[1]])
    user_id = db_fetchone("users", ["id"], ["employee_id"], [user1["employee_id"]])["id"]

    admin = User(*(user2.get(attr) if user2.get(attr) else None for attr in User.__annotations__))
    admin_data = admin.make_db_data("admin", {"password": "Aa1234"})
    db_insert("users", admin_data[0], [admin_data[1]])
    admin_id = db_fetchone("users", ["id"], ["employee_id"], [user2["employee_id"]])["id"]

    # Test new item, user & admin
    with app.app_context():
        userToken = create_access_token(identity=user_id)
    response = client.post("/items/new", headers={
        "Authorization": f"Bearer {userToken}",
        "Content-Type": "application/json"
        }, json=item1)
    assert response.status_code == 200, "User was not allowed to enter item"
    with app.app_context():
        userToken = create_access_token(identity=admin_id)
    response = client.post("/items/new", headers={
        "Authorization": f"Bearer {userToken}",
        "Content-Type": "application/json"
        }, json=item2)
    assert response.status_code == 200, "Admin was not allowed to enter item"


def test_new_item_check(db):
    client = app.test_client()

    user = User(*(user1.get(attr) if user1.get(attr) else None for attr in User.__annotations__))
    user_data = user.make_db_data("user", {"password": "Aa1234"})
    db_insert("users", user_data[0], [user_data[1]])
    user_id = db_fetchone("users", ["id"], ["employee_id"], [user1["employee_id"]])["id"]

    # Test new item, location
    item1["plant"] = "4630"
    with app.app_context():
        userToken = create_access_token(identity=user_id)
    response = client.post("/items/new", headers={
        "Authorization": f"Bearer {userToken}",
        "Content-Type": "application/json"
        }, json=item1)
    assert response.status_code == 400, "User was allowed for wrong location"
    response_json = response.json
    assert "error" in response_json, "error expected"

    # Test new item, cost center
    item1["plant"] = "4631"
    item1["profitCenter"] = "B27712"
    with app.app_context():
        userToken = create_access_token(identity=user_id)
    response = client.post("/items/new", headers={
        "Authorization": f"Bearer {userToken}",
        "Content-Type": "application/json"
        }, json=item1)
    assert response.status_code == 400, "User was allowed for wrong location"
    response_json = response.json
    assert "error" in response_json, "error expected"

    # Test new item, duplicate
    item1["profitCenter"] = "B27912"
    with app.app_context():
        userToken = create_access_token(identity=user_id)
    response = client.post("/items/new", headers={
        "Authorization": f"Bearer {userToken}",
        "Content-Type": "application/json"
        }, json=item1)
    with app.app_context():
        userToken = create_access_token(identity=user_id)
    response = client.post("/items/new", headers={
        "Authorization": f"Bearer {userToken}",
        "Content-Type": "application/json"
        }, json=item1)
    assert response.status_code == 400, "Duplicate items were allowed"
    response_json = response.json
    assert "error" in response_json, "error expected"


def test_pending_items(db):
    client = app.test_client()

    user = User(*(user1.get(attr) if user1.get(attr) else None for attr in User.__annotations__))
    user_data = user.make_db_data("user", {"password": "Aa1234"})
    db_insert("users", user_data[0], [user_data[1]])
    user_id = db_fetchone("users", ["id"], ["employee_id"], [user1["employee_id"]])["id"]

    admin = User(*(user2.get(attr) if user2.get(attr) else None for attr in User.__annotations__))
    admin_data = admin.make_db_data("admin", {"password": "Aa1234"})
    db_insert("users", admin_data[0], [admin_data[1]])
    admin_id = db_fetchone("users", ["id"], ["employee_id"], [user2["employee_id"]])["id"]

    data = {"cost_center": "",
            "Item_ID": "",
            "comment": ""}

    # Test pending item list, admin access
    with app.app_context():
        userToken = create_access_token(identity=user_id)
    response = client.post("/items/pending", headers={
        "Authorization": f"Bearer {userToken}",
        "Content-Type": "application/json"
        }, json=data)
    assert response.status_code == 401, "User was allowed to fetch data"

    with app.app_context():
        userToken = create_access_token(identity=admin_id)
    response = client.post("/items/pending", headers={
        "Authorization": f"Bearer {userToken}",
        "Content-Type": "application/json"
        }, json=data)
    assert response.status_code == 200, "Admin was not allowed to fetch data"


def test_approve_items(db):
    client = app.test_client()

    user = User(*(user1.get(attr) if user1.get(attr) else None for attr in User.__annotations__))
    user_data = user.make_db_data("user", {"password": "Aa1234"})
    db_insert("users", user_data[0], [user_data[1]])
    user_id = db_fetchone("users", ["id"], ["employee_id"], [user1["employee_id"]])["id"]

    admin = User(*(user2.get(attr) if user2.get(attr) else None for attr in User.__annotations__))
    admin_data = admin.make_db_data("admin", {"password": "Aa1234"})
    db_insert("users", admin_data[0], [admin_data[1]])
    admin_id = db_fetchone("users", ["id"], ["employee_id"], [user2["employee_id"]])["id"]

    new_item = Item(*(item1.get(attr) if item1.get(attr) else None for attr in Item.__annotations__))
    new_item_db_data = new_item.make_db_data("pending")
    db_insert("itemsbasic", new_item_db_data[0], [new_item_db_data[1]])
    item_id = db_fetchone("itemsbasic", ["id"], ["man_part_num"], [item1["manufacturerPartNumber"]])["id"]
    data = {"Item_ID": item_id, "SKU": 1}

    # Test approve item
    with app.app_context():
        userToken = create_access_token(identity=admin_id)
    response = client.post("/items/approve", headers={
        "Authorization": f"Bearer {userToken}",
        "Content-Type": "application/json"
        }, json=data)
    assert response.status_code == 200, "Admin was not allowed to fetch data"

    with app.app_context():
        userToken = create_access_token(identity=user_id)
    response = client.post("/items/approve", headers={
        "Authorization": f"Bearer {userToken}",
        "Content-Type": "application/json"
        }, json=data)
    assert response.status_code == 401, "User was allowed to fetch data"
