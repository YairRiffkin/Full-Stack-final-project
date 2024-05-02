
from dataclasses import fields
from flask import Blueprint, request
from flask_jwt_extended import create_access_token, get_jwt, jwt_required
from models.users import User
from database.dbelements.dbfunctions import db_fetchone

bp = Blueprint("auth", __name__)


@bp.route("/login", methods=["POST"])
def login() -> dict:
    print("XXX IN LOGIN XXX")
    data = request.get_json()
    print("backend data received: ", data)
    if "@" in data["username"]:
        search_column = "email"
    else:
        search_column = "employee_id"
    oper_list = [data["username"].upper(), data["password"]]
    user = db_fetchone("users", ["id"], [search_column, "password"], oper_list)
    if user is None:
        return {"error": "Invalid username or password"}, 503
    else:
        access_token = create_access_token(identity=user["id"])
        print("backend access token: ", access_token)
        return {"access_token": access_token}


@bp.route("/users/specific", methods=["GET", "POST"])
@jwt_required()
def get_me() -> dict:
    token_data = get_jwt()
    user_id = token_data["sub"]
    print("user id: ", user_id)
    select_items = [field.name for field in fields(User)]
    user = db_fetchone("users", select_items, ["id"], [user_id])
    if user is None:
        return {"error": "User not found"}
    else:
        return_dict = {item: user[item] for item in select_items}
        return return_dict
