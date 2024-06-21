# Demo data and set up to test working environment

import datetime
import sqlite3
from models.users import User
from database.dbelements.db_query_strings import query_insert
from models.items import Item
from elements.DemoElements import demo_users, demo_levels, demo_items, item_employee


log_string = """INSERT INTO history
            (identifier, type, current, created, action, by, next, relative)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);"""


def creating_demo() -> None:
    conn = sqlite3.connect('database/data.db')
    cursor = conn.cursor()
    # Delete existing data
    cursor.execute("DELETE FROM itemsbasic")
    cursor.execute("DELETE FROM users")
    cursor.execute("DELETE FROM history")
    cursor.execute("DELETE FROM comments")

    for user, level in zip(demo_users, demo_levels):
        # Create user data
        new_user = User(*(user.get(attr) if user.get(attr) else None for attr in User.__annotations__))
        new_user.beautify_user_data()
        new_user_db_data = new_user.make_db_data(level, {"password": "Aa1234"})
        query_string = query_insert("users", new_user_db_data[0])
        cursor.execute(query_string, new_user_db_data[1])
        last_id = cursor.lastrowid
        current_datetime = datetime.datetime.now()
        created = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
        # Log history
        cursor.execute(log_string, (new_user.employee_id,
                                    "user",
                                    new_user.user_level,
                                    created,
                                    "register",
                                    new_user.employee_id,
                                    "admin",
                                    last_id))
        conn.commit()

    for item, employee in zip(demo_items, item_employee):
        # Create items data
        new_item = Item(*(item.get(attr) if item.get(attr) else None for attr in Item.__annotations__))
        if new_item.check_item():
            print(new_item)
        new_item_db_data = new_item.make_db_data("pending")
        query_string = query_insert("itemsbasic", new_item_db_data[0])
        cursor.execute(query_string, new_item_db_data[1])
        last_id = cursor.lastrowid
        current_datetime = datetime.datetime.now()
        created = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
        # Log history
        cursor.execute(log_string, (new_item.manufacturerPartNumber,
                                    "item",
                                    new_item.status,
                                    created,
                                    "register",
                                    employee,
                                    "admin",
                                    last_id))
        conn.commit()
    cursor.close()
    conn.close()


creating_demo()
