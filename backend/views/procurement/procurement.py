
from flask import Blueprint, request
from flask_jwt_extended import get_jwt, jwt_required
from models.items import Item
from database.dbelements.dbfunctions import db_fetchall, db_fetchone, db_insert, db_maxSKU, db_set

bp = Blueprint("procurement", __name__)


@bp.route("/procurement/pending", methods=["GET", "POST"])
@jwt_required()
def get_pending_data() -> dict:
    print("XXX IN procurement PENDING XXX")
    token_data = get_jwt()
    user_id = token_data["sub"]
    data = request.get_json()
    print("COMMENT: ", data["Item_ID"], data["comment"])
    user_data = db_fetchone("users", ["user_level"], ["id"], [user_id])
    if user_data["user_level"] != "proc":
        return {"error": "You are not authorized for this action"}
    else:
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
        key_map = dict(zip(Item.database_columns, annotations))
        index = 1
        return_data = {}
        return_item = {}
        for item in item_list:
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
            return_data[index] = row_dict
            return_item[index] = item
            index += 1
        if data["Item_ID"]:
            db_set(
                "comments",
                ["comment"],
                [repr(str(data["comment"]))],
                str(data["Item_ID"]),
                if_exists=True
                )
        return {"data": return_data, "item": return_item}


@bp.route("/procurement/approve", methods=["GET", "POST"])
@jwt_required()
def get_approve() -> dict:
    print("XXX IN approve PENDING items XXX")
    token_data = get_jwt()
    user_id = token_data["sub"]
    data = request.get_json()
    user_data = db_fetchone("users", ["user_level", "employee_id"], ["id"], [user_id])
    item_data = db_fetchone("itemsbasic", ["SKU"], ["id"], [data["Item_ID"]])
    approver = user_data["user_level"]
    if approver != "proc":
        return {"error": "You are not authorized for this action"}
    else:
        log_data = [
            str(item_data["SKU"]),                # item identifier
            "item",                     # type of object logged
            "final",                 # status
            "to masterdata",           # action to be logged
            user_data["employee_id"],   # user performing the action
            "admin"]                     # next in line for this action
        db_set(
            "itemsbasic",
            ["status"],
            ["final"],
            str(data["Item_ID"]),
            log=log_data
            )
        return {"data": "all good"}
