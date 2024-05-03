
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from database.db import close_db, init_db
from views.auth import auth
from views.users import users

app = Flask(__name__)
app.config.from_prefixed_env()
FRONTEND_URL = app.config.get("FRONTEND_URL")
cors = CORS(app, origins=FRONTEND_URL, methods=["GET", "POST", "DELETE"])
jwt = JWTManager(app)
app.teardown_appcontext(close_db)

app.register_blueprint(auth.bp)
app.register_blueprint(users.bp)

print("starting the app")
init_db()


# flask --app main run
# python -m flask run
