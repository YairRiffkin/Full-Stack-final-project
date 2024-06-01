
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from database.db import close_db, init_db
from views.auth import auth
from views.users import users
from views.items import items
from views.procurement import procurement

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


# @app.errorhandler(Exception)
# def handle_exception(e):
#     logging.exception("An error occurred:")
#     return jsonify(error="An error occurred"), 500


# @app.teardown_appcontext
# def close_database_connection(exception=None):
#     db = g.pop("db", None)
#     if db is not None:
#         db.close()
#     if exception is not None:
#         logging.error("Database error occurred:", exc_info=exception)


print("starting the app")
init_db()


# flask --app main run
# python -m flask run
