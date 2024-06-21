# To handle login functions

from dataclasses import fields
from datetime import timedelta
from flask import Blueprint, app, request
from flask_jwt_extended import create_access_token, get_jwt, jwt_required
from models.users import User
from database.dbelements.dbfunctions import db_fetchone, db_log

bp = Blueprint("auth", __name__)



@bp.route("/login", methods=["POST"])
def login() -> dict:
    """Login function for approved users

    Returns:
        dict:   error: if details are wrong
                access token if correct
    """
    data = request.get_json()
    # username can be either employee ID or email. test is performed accordingly
    if "@" in data["username"]:
        search_column = "email"
        username = data["username"].lower()
    else:
        search_column = "employee_id"
        username = data["username"].upper()
    oper_list = [username, data["password"]]
    user = db_fetchone("users", ["id", "employee_id"], [search_column, "password"], oper_list)
    # If details are wrong return query is empty
    if user is None:
        return {"error": "Invalid username or password"}, 503
    else:
        logged_user = str(user["employee_id"])
        expires_delta = timedelta(hours=8)
        access_token = create_access_token(
            identity=user["id"],
            expires_delta=expires_delta
            )
        # logging action
        db_log(logged_user,     # identifier for the action
               "user",          # type
               "active",        # status
               "login",         # the action
               logged_user,     # done by..
               None,            # next for this action
               False)           # function operator
        return {"access_token": access_token}, 200


@bp.route("/users/specific", methods=["GET", "POST"])
@jwt_required()
def get_me() -> dict:
    """Get user details on login

    Returns:
        dict:   error: if token is wrong (user not found)
                user details if OK
    """
    token_data = get_jwt()
    user_id = token_data["sub"]
    # Gather the user data details from class definition
    select_items = [field.name for field in fields(User)]
    user = db_fetchone("users", select_items, ["id"], [user_id])
    if user is None:
        return {"error": "User not found"}
    else:
        return_dict = {item: user[item] for item in select_items}
        return return_dict
