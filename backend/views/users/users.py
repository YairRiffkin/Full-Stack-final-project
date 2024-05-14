
from dataclasses import fields
from time import sleep
from flask import Blueprint, request
from flask_jwt_extended import create_access_token, get_jwt, jwt_required

from database.dbelements.dbfunctions import db_fetchone, db_insert, db_log, db_set
from models.users import User

bp = Blueprint("users", __name__)


@bp.route("/users/new_user", methods=["POST"])
def new_user() -> dict:
    error = {}
    data = request.get_json()
    if data["password1"] == data["password2"]:
        password = data["password1"]
    else:
        error.update({"Password": ["Passwords don't match"]})
    new_user = User(*(data.get(attr) if data.get(attr) else None for attr in User.__annotations__))
    exceptions = new_user.check_user_details()
    if not exceptions:
        new_user.beautify_user_data()
        if new_user.user_is_duplicate():
            error.update({"Duplicate": ["Either employee ID or email are used by existing user"]})
        else:
            new_user_db_data = new_user.make_db_data("pending", {"password": password})
            log_data = [new_user.employee_id, "user", new_user.user_level, "register", new_user.employee_id, "admin"]
            db_insert(
                        "users",                # table
                        new_user_db_data[0],    # list of columns
                        [new_user_db_data[1]],   # list of data
                        log_data                # history log data
            )
    else:
        error.update(exceptions)
    if error:
        return {"error": error}
    else:
        return {"userData": new_user.make_frontend_data()}


@bp.route("/users/update", methods=["GET", "POST"])
@jwt_required()
def get_me() -> dict:
    token_data = get_jwt()
    data = request.get_json()
    user_id = token_data["sub"]
    user = db_fetchone("users", ["employee_id", "email"], ["id"], [user_id])
    if (user["employee_id"] == data["employee_id"].upper()) and (user["email"] == data["email"].lower()):
        log_data = [data["employee_id"], "user", "active", "update user", data["employee_id"], None]
        updated_user = User(*(data.get(attr) if data.get(attr) else None for attr in User.__annotations__))
        updated_user.beautify_user_data()
        update_data = updated_user.make_update_data()
        db_set("users", update_data[0], update_data[1], user_id, log=log_data)
        return {}
    else:
        return {"error": "You cannot update other users details"}
