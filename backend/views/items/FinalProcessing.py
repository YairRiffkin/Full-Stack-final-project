from flask import Blueprint, request
from flask_jwt_extended import get_jwt, jwt_required
from database.db import get_db
from models.items import Item
from database.dbelements.dbfunctions import db_fetchall, db_fetchone, db_insert, db_maxSKU, db_set
import functools

bp = Blueprint("final", __name__)


@bp.route("/final/update", methods=["GET", "POST"])
def create_final() -> None:
    """Create final data base from items in "final" status
    """
    print("IN final update")
    changed_items_result = fetch_changed_items()
    print(changed_items_result)
    return {"data": "accepted"}


@functools.lru_cache(maxsize=1)
def get_final_items():
    final_list = db_fetchall("itemsbasic", ["*"], ["status"], ["final"])
    final_items = [dict(row) for row in final_list]
    print("final items: ", final_items)
    return final_items


def fetch_changed_items():
    cached_items = get_final_items()
    print("cached: ", cached_items)
    latest_items = get_final_items()
    changed_items = [item for item in latest_items if item not in cached_items]
    print("changed items: ", changed_items)
    if changed_items:
        get_final_items.cache_clear()
    return changed_items
