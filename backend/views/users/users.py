
from flask import Blueprint, request
from flask_jwt_extended import create_access_token, get_jwt, jwt_required

from database.dbelements.dbfunctions import db_insert
from models.users import User

bp = Blueprint("users", __name__)


@bp.route("/new_user", methods=["POST"])
def new_user() -> dict:
    print("XXX IN NEW USER XXX")
    error = {}
    data = request.get_json()
    if data["password1"] == data["password2"]:
        password = data["password1"]
        print("password: ", password)
    else:
        error.update({"Password": ["Passwords don't match"]})
    new_user = User(*(data.get(attr) if data.get(attr) else None for attr in User.__annotations__))
    exceptions = new_user.check_user_details()
    print("exceptions: ", exceptions)
    if not exceptions:
        new_user.beautify_user_data()
        print("Nice new user: ", new_user)
        if new_user.user_is_duplicate():
            error.update({"Duplicate": ["Either employee ID or email are used by existing user"]})
        else:
            new_user_db_data = new_user.make_db_data("pending", {"password": password})
            db_insert("users", new_user_db_data[0], [new_user_db_data[1]])
            print(new_user.make_frontend_data())
    else:
        error.update(exceptions)
    if error:
        print("error: ", {"error": error})
        return {"error": error}
    else:
        return {"userData": new_user.make_frontend_data()}
