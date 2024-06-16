# Final stage simulates Excel sheet creation which is not in project scope

from flask import Blueprint, request
from flask_jwt_extended import get_jwt, jwt_required
from database.FinalDatabase.Update import update_data
from database.dbelements.dbfunctions import db_fetchall, db_fetchone

bp = Blueprint("final", __name__)


@bp.route("/final/basic", methods=["GET", "POST"])
@jwt_required()
def final_basic_data() -> None:
    """Creates the final basic_data table
    """
    error = []
    token_data = get_jwt()
    user_id = token_data["sub"]
    data = request.get_json()
    user_data = db_fetchone("users", ["user_level"], ["id"], [user_id])
    if user_data["user_level"] == "admin":
        return_details = db_fetchall("itemsbasic",  # database
                                     ["*"],         # data to fetch
                                     ["status"],       # if this data..
                                     ["final"]     # equals to this
                                     )
        item_list = [dict(row) for row in return_details]
        return_data = update_data(item_list, data["table"])
        error = return_data[2]
        if error:
            return {"error": error}, 400
        else:
            return {"details": return_data[0], "data": return_data[1]}, 200
    else:
        return {"error": "you are not authorized for this action"}, 401
