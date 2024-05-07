
import datetime
from database.db import get_db
from database.dbelements.db_query_strings import query_insert, query_select, query_set


def db_fetchone(table: str,
                select_item: list,
                columns: list,
                operators: list
                ) -> dict:
    """Perform a SELECT from the database with given parameters:
        table name, item to look for, columns to search in and
        parameters to look for in these columns"""
    query_string = query_select(table, select_item, columns)
    print("db fetch string: ", query_string, operators)
    db = get_db()
    cursor = db.cursor()
    cursor.execute(query_string, operators)
    user = cursor.fetchone()
    return user


def db_insert(table: str,
              columns: list,
              data_items: list,
              log: list = None
              ) -> None:
    """Insert a set of data into the relevant table"""
    query_string = query_insert(table, columns)
    print("string: ", query_string)
    db = get_db()
    cursor = db.cursor()
    for data in data_items:
        cursor.execute(query_string, data)
        if log:
            db_log(*log)
    db.commit()
    db.close()


def db_log(identifier: str,         # what is the object logged identifier
           type: str,               # what is the type of object (user, item)
           current: str,            # current status (pending, active)
           action: str,             # action performed (approve, update)
           by: str,                 # user performing the action identifier
           next: str,               # who is next in line for this action
           external: bool = True,   # True if called from another INSERT db function
           table: str = "history"   # log data table. default "history" table
           ) -> None:
    """Log actions in database for reference"""
    query_string = f"""INSERT INTO {table}
                        (identifier, type, current, created, action, by, next)
                        VALUES (?, ?, ?, ?, ?, ?, ?);"""
    current_datetime = datetime.datetime.now()
    created = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    # Format it as YYYY-MM-DD HH:MM:SS
    db = get_db()
    cursor = db.cursor()
    cursor.execute(query_string, (identifier, type, current, created, action, by, next))
    if not external:
        db.commit()
        db.close()


def db_set(table: str,
           columns: list,
           values: list,
           condition_value: str,
           condition_key: str = "id",
           log: list = None
           ) -> None:
    query_string = query_set(table, columns, values)
    query_string = query_string + f"{condition_key} = {condition_value};"
    print("set query string: ", query_string)
    print("set log: ", log)
    db = get_db()
    cursor = db.cursor()
    cursor.execute(query_string)
    if log:
        db_log(*log)
    db.commit()
    db.close()
# WHERE user_id = 1;