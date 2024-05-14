
from dataclasses import fields
from datetime import timedelta
from flask import Blueprint, request
from flask_jwt_extended import create_access_token, get_jwt, jwt_required
from models.users import User
from database.dbelements.dbfunctions import db_fetchone, db_log

bp = Blueprint("auth", __name__)


@bp.route("/login", methods=["POST"])
def login() -> dict:
    print("XXX IN LOGIN XXX")
    data = request.get_json()
    if "@" in data["username"]:
        search_column = "email"
        username = data["username"].lower()
    else:
        search_column = "employee_id"
        username = data["username"].upper()
    oper_list = [username, data["password"]]
    user = db_fetchone("users", ["id", "employee_id"], [search_column, "password"], oper_list)
    logged_user = str(user["employee_id"])
    if user is None:
        return {"error": "Invalid username or password"}, 503
    else:
        expires_delta = timedelta(hours=8)
        access_token = create_access_token(identity=user["id"], expires_delta=expires_delta)
        db_log(logged_user, "user", "active", "login", logged_user, None, False)
        return {"access_token": access_token}


@bp.route("/users/specific", methods=["GET", "POST"])
@jwt_required()
def get_me() -> dict:
    token_data = get_jwt()
    user_id = token_data["sub"]
    select_items = [field.name for field in fields(User)]
    print("select items: ", select_items)
    user = db_fetchone("users", select_items, ["id"], [user_id])
    if user is None:
        return {"error": "User not found"}
    else:
        return_dict = {item: user[item] for item in select_items}
        print("return dict: ", return_dict)
        return return_dict
