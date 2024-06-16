
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dbDemo import creating_demo
from database.db import close_db, init_db
from views import auth
from views import users
from views import items
from views import FinalProcessing
from views import procurement

app = Flask(__name__)
app.config.from_prefixed_env()
FRONTEND_URL = app.config.get("FRONTEND_URL")
cors = CORS(app, origins=FRONTEND_URL, methods=["GET", "POST", "DELETE"])
jwt = JWTManager(app)
app.teardown_appcontext(close_db)

app.register_blueprint(auth.bp)
app.register_blueprint(users.bp)
app.register_blueprint(items.bp)
app.register_blueprint(procurement.bp)
app.register_blueprint(FinalProcessing.bp)


print("starting the app")
init_db()


# flask --app main run
# python -m flask run
