
from flask import Blueprint, request
from flask_jwt_extended import get_jwt, jwt_required
from elements.out_of_class_validations import check_password, ok_to_update_password
from database.dbelements.dbfunctions import db_fetchall, db_fetchone, db_insert, db_log, db_set
from models.users import User

bp = Blueprint("users", __name__)


@bp.route("/users/new_user", methods=["POST"])
def new_user() -> dict:
    error = {}
    data = request.get_json()
    issues = check_password(data["password1"], data["password2"])
    if not issues["Password"]:
        password = data["password1"]
    else:
        error.update(issues)
    new_user = User(*(data.get(attr) if data.get(attr) else None for attr in User.__annotations__))
    exceptions = new_user.check_user_details()
    print("exceptions: ", exceptions, "error: ", error)
    if not exceptions:
        new_user.beautify_user_data()
        if new_user.user_is_duplicate():
            error.update({"Duplicate": ["Either employee ID or email are used by existing user"]})
        else:
            password = data["password1"]
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
    error = {}
    token_data = get_jwt()
    data = request.get_json()
    user_id = token_data["sub"]
    user = db_fetchone("users", ["employee_id", "email"], ["id"], [user_id])
    print("password1: ", data["password1"])
    if data["password1"]:
        update = ok_to_update_password(user_id)
        print("UPDATE: ", update)
        if update:
            issues = check_password(data["password1"], data["password2"])
            print("issues: ", issues["Password"])
            if not issues["Password"]:
                print("---> setting new password")
                log_data = [data["employee_id"], "user", "active", "update password", data["employee_id"], None]
                db_set("users", ["password"], [data["password1"]], user_id, log=log_data)
            else:
                error.update(issues)
    user_is_user = (user["employee_id"] == data["employee_id"].upper()) and (user["email"] == data["email"].lower())
    print("user: ", user_is_user, "error: ", error)
    if user_is_user and not error:
        log_data = [data["employee_id"], "user", "active", "update user", data["employee_id"], None]
        updated_user = User(*(data.get(attr) if data.get(attr) else None for attr in User.__annotations__))
        updated_user.beautify_user_data()
        update_data = updated_user.make_update_data()
        db_set("users", update_data[0], update_data[1], user_id, log=log_data)
        return {}
    else:
        error.update({"authorization": "You cannot update other users details"})
    if error:
        return {"error": error}
    else:
        return {"data": "all good"}


@bp.route("/users/pending", methods=["GET", "POST"])
@jwt_required()
def get_pending_data() -> dict:
    token_data = get_jwt()
    user_id = token_data["sub"]
    user_data = db_fetchone("users", ["user_level"], ["id"], [user_id])
    if user_data["user_level"] != "admin":
        return {"error": "You are not authorized for this action"}
    else:
        return_details = db_fetchall("users",
                                     ["*"],
                                     ["user_level"],
                                     ["pending"]
                                     )
        user_list = [dict(row) for row in return_details]
        annotations = list(User.__annotations__.keys())
        annotations.remove("id")
        key_map = dict(zip(User.database_columns, annotations))
        index = 1
        return_data = {}
        return_user = {}
        for user in user_list:
            db_row = db_fetchone("history",
                                 ["by", "created", "action"],
                                 ["current", "next", "relative"],
                                 ["pending", "admin", user["id"]]
                                 )
            name = db_fetchone("users", ["username"], ["employee_id"], [db_row["by"]])
            relative = user["id"]
            user.pop("id")
            user = {key_map.get(k, k): v for k, v in user.items()}
            row_dict = dict(zip(["by", "created", "action"], db_row))
            row_dict["username"] = str(name[0])
            row_dict["relative"] = relative
            return_data[index] = row_dict
            return_user[index] = user
            index += 1
        return {"data": return_data, "user": return_user}


@bp.route("/users/approve", methods=["GET", "POST"])
@jwt_required()
def get_approve() -> dict:
    print("IN USER APPROVE")
    token_data = get_jwt()
    user_id = token_data["sub"]
    data = request.get_json()
    user_data = db_fetchone("users", ["user_level", "employee_id"], ["id"], [user_id])
    updated_user = db_fetchone("users", ["user_level", "employee_id"], ["id"], [data["ID"]])
    approver = user_data["user_level"]
    if approver != "admin":
        return {"error": "You are not authorized for this action"}
    else:
        log_data = [
            updated_user["employee_id"],    # user identifier
            "user",                         # type of object logged
            "active",                       # status
            "approved",                     # action to be logged
            user_data["employee_id"],       # user performing the action
            ""                              # next in line for this action
            ]
        print("log data: ", log_data)
        db_set(
            "users",
            ["user_level"],
            [data["User_level"]],
            str(data["ID"]),
            log=log_data
            )
        return {"data": "all good"}


@bp.route("/users/password", methods=["GET", "POST"])
@jwt_required()
def check_password_input() -> dict:
    print("IN CHECK PASSWORD")
    token_data = get_jwt()
    user_id = token_data["sub"]
    data = request.get_json()
    user_data = db_fetchone("users", ["employee_id", "password"], ["id"], [user_id])
    if user_data["password"] == data["password"]:
        db_log(
            user_data["employee_id"],
            "user",
            "active",
            "check password",
            user_data["employee_id"],
            None,
            False,
            user_id
            )
        return {"data": "all good"}
    else:
        return {"error": "Password does not match"}
