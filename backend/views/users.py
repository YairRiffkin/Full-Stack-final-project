# To handle user manipulation and registration

from flask import Blueprint, request
from flask_jwt_extended import get_jwt, jwt_required
from elements.out_of_class_validations import check_password, ok_to_update_password
from database.dbelements.dbfunctions import db_fetchall, db_fetchone, db_insert, db_log, db_set
from models.users import User

bp = Blueprint("users", __name__)


@bp.route("/users/new_user", methods=["POST"])
def new_user() -> dict:
    """Registering a new user

    Returns:
        dict:   error: if entered data is wrong for any reason
                if OK: logs the details under "pending" status and returns the information to the user
    """
    error = {}
    data = request.get_json()
    # Checking password is correct
    issues = check_password(data["password1"], data["password2"])
    if not issues["Password"]:
        password = data["password1"]
    else:
        error.update(issues)
    new_user = User(*(data.get(attr) if data.get(attr) else None for attr in User.__annotations__))
    # Checking all details are in correct format
    exceptions = new_user.check_user_details()
    if not exceptions:
        # Create standard appearance
        new_user.beautify_user_data()
        # Checking if existing
        if new_user.user_is_duplicate():
            error.update({"Duplicate": ["Either employee ID or email are used by existing user"]})
        else:
            # If all is good creating new user in DB
            password = data["password1"]
            new_user_db_data = new_user.make_db_data("pending",
                                                     {"password": password}
                                                     )
            log_data = [new_user.employee_id,   # identifier
                        "user",                 # type
                        new_user.user_level,    # status
                        "register",             # action
                        new_user.employee_id,   # performed by..
                        "admin"                 # next in action
                        ]
            db_insert(
                        "users",                # table
                        new_user_db_data[0],    # list of columns
                        [new_user_db_data[1]],  # list of data
                        log_data                # history log data
            )
    else:
        error.update(exceptions)
    if error:
        return {"error": error}, 403
    else:
        return {"userData": new_user.make_frontend_data()}, 200


@bp.route("/users/update", methods=["GET", "POST"])
@jwt_required()
def get_me() -> dict:
    """If user want to update details

    Returns:
        dict: error: if something is wrong
        if OK: logs the details and returns the information to the user
    """
    error = {}
    error_type = None
    token_data = get_jwt()
    data = request.get_json()
    user_id = token_data["sub"]
    user = db_fetchone("users", ["employee_id", "email"], ["id"], [user_id])
    # verify user is updating only his details
    try:
        user_is_user = (user["employee_id"] == data["employee_id"].upper()) and (user["email"] == data["email"].lower())
    except TypeError:
        user_is_user = None
    if user_is_user:
        # Checking if update includes password
        if data["password1"]:
            # Extra security check
            update = ok_to_update_password(user_id)
            if update:
                # Checking correct password
                issues = check_password(data["password1"], data["password2"])
                # If OK - updating password and logging action
                if not issues["Password"]:
                    log_data = [data["employee_id"],    # Identifier
                                "user",                 # type
                                "active",               # status
                                "update password",      # action
                                data["employee_id"],    # performed by..
                                None                    # next for action
                                ]
                    db_set("users",                 # table
                           ["password"],            # detail
                           [data["password1"]],     # data
                           user_id,                 # Where id(default)
                           log=log_data             # log action
                           )
                else:
                    error.update(issues)
                    error_type = 400
            else:
                error.update({"authorization": "You have not entered your old password"})
                error_type = 403
        else:
            # perform update
            log_data = [
                data["employee_id"],    # Identifier
                "user",                 # type
                "active",               # status
                "update user",          # action
                data["employee_id"],    # performed by..
                None                    # next for action
                ]
            updated_user = User(*(data.get(attr) if data.get(attr) else None for attr in User.__annotations__))
            # make sure format is standard
            updated_user.beautify_user_data()
            update_data = updated_user.make_update_data()
            # log change
            db_set("users", update_data[0], update_data[1], user_id, log=log_data)
    else:
        error.update({"authorization": "You cannot update other users details"})
        error_type = 401
    if error:
        return {"error": error}, error_type
    else:
        return {"data": "all good"}, 200


@bp.route("/users/pending", methods=["GET", "POST"])
@jwt_required()
def get_pending_data() -> dict:
    """Get "pending" users list

    Returns:
        dict: users details, history details
    """
    token_data = get_jwt()
    user_id = token_data["sub"]
    user_data = {}
    try:
        user_data = db_fetchone("users", ["user_level"], ["id"], [user_id])["user_level"]
    except TypeError:
        user_data = ""
        # action allowed only for admin
        if user_data != "admin":
            return {"error": "You are not authorized for this action"}, 401
    else:
        try:
            return_details = db_fetchall("users",
                                         ["*"],
                                         ["user_level"],
                                         ["pending"]
                                         )
            user_list = [dict(row) for row in return_details]
            annotations = list(User.__annotations__.keys())
            annotations.remove("id")
            # matching DB headers with TYPE attributes
            key_map = dict(zip(User.database_columns, annotations))
            index = 1
            return_data = {}
            return_user = {}
            for user in user_list:
                # creating history details
                db_row = db_fetchone("history",
                                     ["by", "created", "action"],
                                     ["current", "next", "relative"],
                                     ["pending", "admin", user["id"]]
                                     )
                name = db_fetchone("users", ["username"], ["employee_id"], [db_row["by"]])
                relative = user["id"]
                user.pop("id")
                # creating users list
                user = {key_map.get(k, k): v for k, v in user.items()}
                row_dict = dict(zip(["by", "created", "action"], db_row))
                row_dict["username"] = str(name[0])
                row_dict["relative"] = relative
                return_data[index] = row_dict
                return_user[index] = user
                index += 1
        except TypeError:
            return_data = {}
            return_user = {}
        return {"data": return_data, "user": return_user}, 200


@bp.route("/users/approve", methods=["GET", "POST"])
@jwt_required()
def get_approve() -> None:
    """Approve pending user
    """
    token_data = get_jwt()
    user_id = token_data["sub"]
    data = request.get_json()
    try:
        user_data = db_fetchone("users", ["user_level", "employee_id"], ["id"], [user_id])
        approver = user_data["user_level"]
    except TypeError:
        approver = ""
    # action allowed only for admin
    if approver != "admin":
        return {"error": "You are not authorized for this action"}, 401
    else:
        updated_user = db_fetchone("users", ["user_level", "employee_id"], ["id"], [data["ID"]])
        log_data = [
            updated_user["employee_id"],    # user identifier
            "user",                         # type of object logged
            "active",                       # status
            "approved",                     # action to be logged
            user_data["employee_id"],       # user performing the action
            ""                              # next in line for this action
            ]
        db_set(
            "users",
            ["user_level"],
            [data["User_level"]],
            str(data["ID"]),
            log=log_data
            )
        return {"data": "all good"}, 200


@bp.route("/users/password", methods=["GET", "POST"])
@jwt_required()
def check_password_input() -> None:
    """Verify old password when changing password

    Returns:
        logs action for security check
    """
    token_data = get_jwt()
    user_id = token_data["sub"]
    data = request.get_json()
    user_data = db_fetchone("users", ["employee_id", "password"], ["id"], [user_id])
    if user_data["password"] == data["password"]:
        db_log(
            user_data["employee_id"],   # identifier
            "user",                     # type
            "active",                   # status
            "check password",           # action
            user_data["employee_id"],   # performed by..
            None,                       # next in action
            False,                      # internal function operator
            user_id                     # log id for reference
            )
        return {"data": "all good"}, 200
    else:
        return {"error": "Password does not match"}, 400


@bp.route("/users/getdata", methods=["GET", "POST"])
@jwt_required()
def get_employee_data() -> dict:
    """Get employee data for level update

    Returns:
        dict:   error: if details are wrong or unauthorized
                user details if correct 
    """
    error = {}
    error_type = None
    token_data = get_jwt()
    data = request.get_json()
    user_id = token_data["sub"]
    user_data = db_fetchone("users", ["user_level"], ["id"], [user_id])
    # action allowed only for admin
    if user_data["user_level"] == "admin":
        employee_data = db_fetchone(
            "users",
            ["username", "employee_id", "role", "location", "user_level"],
            ["employee_id"],
            [data["employeeID"].upper()]
            )
        if employee_data:
            # create return dict
            user = dict(employee_data)
            annotations = list(User.__annotations__.keys())
            annotations.remove("id")
            # create match between DB headers and TYPE attributes
            key_map = dict(zip(User.database_columns, annotations))
            employee = {key_map.get(k, k): v for k, v in user.items()}
        else:
            error["Data"] = "User does not exist"
            error_type = 400
    else:
        error["Authorization"] = "You are not authorized for this action"
        error_type = 401
    if error:
        return {"error": error}, error_type
    else:
        return {"data": employee}, 200


@bp.route("/users/changelevel", methods=["GET", "POST"])
@jwt_required()
def update_level() -> None:
    """Change the level of the user

    Returns:
        logs the change
    """
    error = {}
    token_data = get_jwt()
    data = request.get_json()
    user_id = token_data["sub"]
    user_data = db_fetchone("users", ["user_level", "employee_id"], ["id"], [user_id])
    if user_data["user_level"] == "admin":
        log_data = [
            data["ID"].upper(),         # user identifier
            "user",                     # type of object logged
            "active",                   # status
            "change level",             # action to be logged
            user_data["employee_id"],   # user performing the action
            ""                          # next in line for this action
            ]
        db_set(
            "users",
            ["user_level"],
            [data["User_level"]],
            f"'{data['ID'].upper()}'",
            "employee_id",
            log_data
        )
    else:
        error["Authorization"] = "You are not authorized for this action"
    if error:
        return {"error": error}, 401
    else:
        return {"data": "all good"}, 200
