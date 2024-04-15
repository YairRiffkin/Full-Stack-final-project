# flask --app main run

from db import close_db, get_db
from flask import Flask, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt, jwt_required

app = Flask(__name__)
app.config.from_prefixed_env()
FRONTEND_URL = app.config.get("FRONTEND_URL")
cors = CORS(app, origins=FRONTEND_URL, methods=["GET", "POST", "DELETE"])
jwt = JWTManager(app)
app.teardown_appcontext(close_db)


@app.route("/login", methods=["POST"])
def login() -> dict:
    data = request.get_json()
    if "@" in data["username"]:
        search_column = "email"
    else:
        search_column = "employee_id"
    print(data["username"], search_column)
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        f"SELECT id FROM users WHERE {search_column} = ? AND password = ?",
        (data["username"].upper(), data["password"]),
    )
    user = cursor.fetchone()
    if user is None:
        return {"error": "Invalid username or password"}
    else:
        access_token = create_access_token(identity=user["id"])
        return {"access_token": access_token}


@app.route("/users/specific", methods=["GET", "POST"])
@jwt_required()
def get_me() -> dict:
    token_data = get_jwt()
    user_id = token_data["sub"]
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        """SELECT id, username, employee_id, location, role, user_level
        FROM users WHERE id = ?""",
        (user_id,))
    user = cursor.fetchone()
    print(user["username"])
    if user is None:
        return {"error": "User not found"}
    else:
        return {
            "id": user["id"],
            "username": user["username"],
            "employee_id": user["employee_id"],
            "location": user["location"],
            "role": user["role"],
            "user_level": user["user_level"],
        }

