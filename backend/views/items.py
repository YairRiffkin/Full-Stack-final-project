# Treat all item request coming from front end:
# 1. New item request.
# 2. Pending items list.
# 3. Item approval by Administrator.
# 4. Full items list.

from flask import Blueprint, request
from flask_jwt_extended import get_jwt, jwt_required
from database.db import get_db
from models.items import Item
from database.dbelements.dbfunctions import db_fetchall, db_fetchone, db_insert, db_maxSKU, db_set

bp = Blueprint("items", __name__)


@bp.route("/items/new", methods=["GET", "POST"])
@jwt_required()
def new_item() -> dict:
    """New item details validation and storage
    Returns:
        dict:   Key: Error, if something is wrong with the details.
                key: Data, if the action was performed.
    """
    error = []
    print("in new item app")
    token_data = get_jwt()
    user_id = token_data["sub"]
    data = request.get_json()
    user_data = db_fetchone("users",
                            ["location", "employee_id", "user_level"],
                            ["id"], [user_id]
                            )
    user_level = user_data["user_level"]
    # Item registration allowed only for User and Administrator
    if user_level != "user" and user_level != "admin":
        error.append("You are not authorized for this action")
    new_item = Item(*(data.get(attr) if data.get(attr) else None for attr in Item.__annotations__))
    # User can only register an item for his location of work
    if new_item.plant != Item.locations[user_data["location"]] and user_level == "user":
        error.append("You are not authorized for this site.")
    if new_item.item_is_duplicate():
        error.append("There is already an item from this supplier with the same manufacturer number")
    # Checking item details validation according to standard
    check_error = new_item.check_item()
    if check_error:
        error.append(new_item.check_item())
    # error.append(new_item.check_item())
    print("error: ", error)
    if error:
        return {"error": error}, 400
    else:
        print("no error so far")
        # Prepare data for database
        new_item_db_data = new_item.make_db_data("pending")
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
        return {"data": "accepted"}, 200


@bp.route("/items/pending", methods=["GET", "POST"])
@jwt_required()
def get_pending_data() -> dict:
    """Return the list of pending items for administrator.
    Returns:
        dict:   Error, if something is wrong with the details.
                If no error:
                key: Data, Logged data of who made the application.
                key: Item, Item details.
                key: MaxSKU, to increment SKU numbers accordingly
    """
    token_data = get_jwt()
    user_id = token_data["sub"]
    data = request.get_json()
    user_data = db_fetchone("users", ["user_level"], ["id"], [user_id])
    # Approval is possible only by administrator
    if user_data["user_level"] != "admin":
        return {"error": "You are not authorized for this action"}, 401
    else:
        # Creating a display list with class attribute and database data
        if data["cost_center"] == "" or data["cost_center"] == "--Choose--":
            columns = ["status"]
            parameters = ["pending"]
        else:
            cost_center = data["cost_center"]
            columns = ["profit_center", "status"]
            parameters = [cost_center, "pending"]
        return_details = db_fetchall("itemsbasic",  # database
                                     ["*"],         # data to fetch
                                     columns,       # if this data..
                                     parameters     # equals to this
                                     )
        item_list = [dict(row) for row in return_details]
        annotations = list(Item.__annotations__.keys())
        annotations.remove("id")
        key_map = dict(zip(Item.database_columns, annotations))
        index = 1
        return_data = {}
        return_item = {}
        return_maxSKU = ""
        for item in item_list:
            db_row = db_fetchone(
                "history",                          # database
                ["by", "created", "action"],        # data to fetch
                ["current", "next", "relative"],    # if this data..
                ["pending", "admin", item["id"]]    # equals to this
                )
            name = db_fetchone(
                "users",            # database
                ["username"],        # data to fetch
                ["employee_id"],    # if this data...
                [db_row["by"]]      # equals to this
                )
            relative = item["id"]
            item.pop("id")
            item = {key_map.get(k, k): v for k, v in item.items()}
            row_dict = dict(zip(["by", "created", "action"], db_row))
            row_dict["username"] = str(name[0])
            row_dict["relative"] = relative
            return_data[index] = row_dict
            return_item[index] = item
            index += 1
        return_maxSKU = db_maxSKU()
        # if the administrator does not approve but there is a comment it will be stored in the database for reference
        if data["comment"]:
            db_set(
                "comments",                     # datbase
                ["comment"],                    # data to update
                [repr(str(data["comment"]))],   # comment
                str(data["Item_ID"]),           # data identifier is item id.
                if_exists=True                  # function operator: if the id is already logged it will update. If not it will create
                )
        return {"data": return_data, "item": return_item, "maxSKU": return_maxSKU}, 200


@bp.route("/items/approve", methods=["GET", "POST"])
@jwt_required()
def get_approve() -> dict:
    """Approval of registered item.
    Returns:
        dict:   Key: Error, if something is wrong with the details.
                key: Data, if the action was performed.
    """
    token_data = get_jwt()
    user_id = token_data["sub"]
    data = request.get_json()
    user_data = db_fetchone("users", ["user_level", "employee_id"], ["id"], [user_id])
    approver = user_data["user_level"]
    # action allowed only for administrator
    if approver != "admin":
        return {"error": "You are not authorized for this action"}, 401
    else:
        log_data = [
            data["SKU"],                # item identifier
            "item",                     # type of object logged
            "approved",                 # status
            "to procurement",           # action to be logged
            user_data["employee_id"],   # user performing the action
            "proc"]                     # next in line for this action
        db_set(
            "itemsbasic",                   # database
            ["SKU", "status"],              # columns to update
            [str(data["SKU"]), "proc"],     # data to update
            str(data["Item_ID"]),           # if id = id
            log=log_data                    # action log data
            )
        return {"data": "all good"}, 200


@bp.route("/items/list", methods=["GET", "POST"])
@jwt_required()
def get_item_list() -> dict:
    """Get list of all items in the system.
    Returns:
        dict: item display list
    """
    token_data = get_jwt()
    user_id = token_data["sub"]
    # Allowed for all system users
    if user_id:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM itemsbasic;")
        result = cursor.fetchall()
        # Creating a display list with class attribute and database data
        item_list = [dict(row) for row in result]
        annotations = list(Item.__annotations__.keys())
        annotations.remove("id")
        key_map = dict(zip(Item.database_columns, annotations))
        return_item = []
        for item in item_list:
            comment = db_fetchone("comments",
                                  ["comment"],
                                  ["id"], [item["id"]]
                                  )
            if comment and comment[0]:
                print("comment: ", comment[0])
            item = {key_map.get(k, k): v for k, v in item.items()}
            # getting comments if exist
            if comment and comment[0]:
                item["rem"] = comment[0]
                print("ITEM: ", item)
            return_item.append(item)
        return {"item": return_item}, 200
    else:
        # In case someone got into the system without being registered
        return {"error": "how the hell did you get here?"}, 401
