from dataclasses import fields
from time import sleep
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt, jwt_required

from models.items import Item
from database.dbelements.dbfunctions import db_fetchall, db_fetchone, db_insert, db_join, db_log, db_set
from models.users import User
from elements.ItemFormDetails import item_form_details

bp = Blueprint("items", __name__)


@bp.route("/items/new", methods=["GET", "POST"])
@jwt_required()
def get_me() -> dict:
    error = []
    token_data = get_jwt()
    user_id = token_data["sub"]
    data = request.get_json()
    user_data = db_fetchone("users", ["location", "employee_id"], ["id"], [user_id])
    new_item = Item(*(data.get(attr) if data.get(attr) else None for attr in Item.__annotations__))
    if new_item.plant != Item.locations[user_data["location"]]:
        error = ["You are not authorized for this site."]
    else:
        error = (new_item.check_item())
    # TODO: remember to remove this
    error = []
    if error:
        return {"error": error}
    else:
        new_item_db_data = new_item.make_db_data("pending")
        print("item data: ", new_item_db_data)
        log_data = [
                    new_item.manufacturerPartNumber,    # until approved this is the item identifier 
                    "item",                             # type of object logged
                    new_item.status,                    # request status - default "pending"
                    "register",                         # action to be logged
                    user_data["employee_id"],           # user performing the action
                    "admin"]                            # next in line for this action
        db_insert("itemsbasic",             # table
                  new_item_db_data[0],      # list of columns
                  [new_item_db_data[1]],    # list of data
                  log_data                  # history log data
                  )
        return {"data": "accepted"}


@bp.route("/items/pending", methods=["GET", "POST"])
@jwt_required()
def get_pending_data() -> dict:
    print("XXX IN PENDING XXX")
    token_data = get_jwt()
    user_id = token_data["sub"]
    data = request.get_json()
    print("data: ", data)
    user_data = db_fetchone("users", ["user_level"], ["id"], [user_id])
    admin_pending = None
    if user_data["user_level"] == "admin":
        admin_pending = db_join(leading_table="history",
                                joined_table="users",
                                selected_main=["created", "relative", "by"],
                                selected_join=["username"],
                                join=["by", "employee_id"],
                                columns=["type", "current", "next"],
                                numbered="created",
                                operators=["item", "pending", "admin"]
                                )
        admin_pending = [dict(row) for row in admin_pending]
        return_list = {}
        for item in admin_pending:
            id = item["id"]
            item.pop("id", None)
            return_list[id] = item
    print("return list: ", return_list)
    return {"data": return_list}



