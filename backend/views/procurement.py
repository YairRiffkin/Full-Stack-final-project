# Handles procurement functions
from flask import Blueprint, request
from flask_jwt_extended import get_jwt, jwt_required
from models.items import Item
from database.dbelements.dbfunctions import db_fetchall, db_fetchone, db_set

bp = Blueprint("procurement", __name__)


@bp.route("/procurement/pending", methods=["GET", "POST"])
@jwt_required()
def get_pending_data() -> dict:
    """Get list of pending items for procurement approval

    Returns:
        dict:   error: if wrong
                item list if correct
    """
    token_data = get_jwt()
    user_id = token_data["sub"]
    data = request.get_json()
    user_data = db_fetchone("users", ["user_level"], ["id"], [user_id])
    # Only procurement allowed for this action
    if user_data["user_level"] != "proc":
        return {"error": "You are not authorized for this action"}, 401
    else:
        # Create list
        columns = ["status"]
        parameters = ["proc"]
        return_details = db_fetchall("itemsbasic",
                                     ["*"],
                                     columns,
                                     parameters
                                     )
        item_list = [dict(row) for row in return_details]
        annotations = list(Item.__annotations__.keys())
        annotations.remove("id")
        # matching DB headers to TYPE attributes
        key_map = dict(zip(Item.database_columns, annotations))
        index = 1
        return_data = {}
        return_item = {}
        for item in item_list:
            # history data
            db_row = db_fetchone("history",
                                 ["by", "created", "action"],
                                 ["current", "next", "relative"],
                                 ["approved", "proc", item["id"]]
                                 )
            name = db_fetchone("users", ["username"], ["employee_id"], [db_row["by"]])
            relative = item["id"]
            item.pop("id")
            item = {key_map.get(k, k): v for k, v in item.items()}
            row_dict = dict(zip(["by", "created", "action"], db_row))
            row_dict["username"] = str(name[0])
            row_dict["relative"] = relative
            # history details
            return_data[index] = row_dict
            # item details
            return_item[index] = item
            index += 1
        # option to add comment if not approved
        if data["Item_ID"]:
            db_set(
                "comments",
                ["comment"],
                [repr(str(data["comment"]))],
                str(data["Item_ID"]),
                if_exists=True
                )
        return {"data": return_data, "item": return_item}, 200


@bp.route("/procurement/approve", methods=["GET", "POST"])
@jwt_required()
def get_approve() -> None:
    """Approve pending items

    Returns:
        _type_: error if not authorized, logs action if all correct
    """
    token_data = get_jwt()
    user_id = token_data["sub"]
    data = request.get_json()
    user_data = db_fetchone("users", ["user_level", "employee_id"], ["id"], [user_id])
    item_data = db_fetchone("itemsbasic", ["SKU"], ["id"], [data["Item_ID"]])
    approver = user_data["user_level"]
    # only procurement allowed to perform this action
    if approver != "proc":
        return {"error": "You are not authorized for this action"}, 401
    else:
        log_data = [
            str(item_data["SKU"]),      # item identifier
            "item",                     # type of object logged
            "final",                    # status
            "to masterdata",            # action to be logged
            user_data["employee_id"],   # user performing the action
            "admin"]                    # next in line for this action
        db_set(
            "itemsbasic",
            ["status"],
            ["final"],
            str(data["Item_ID"]),
            log=log_data
            )
        return {"data": "all good"}, 200
