
import datetime
from database.db import get_db
from database.dbelements.db_query_strings import query_insert, query_select, query_set, query_set_if_exists


def db_fetchone(table: str,
                select_item: list,
                columns: list,
                operators: list
                ) -> dict:
    """Perform a SELECT from the database with given parameters:
        table name, item to look for, columns to search in and
        parameters to look for in these columns"""
    query_string = query_select(table, select_item, columns)
    db = get_db()
    cursor = db.cursor()
    cursor.execute(query_string, operators)
    result = cursor.fetchone()
    # db.close()
    return result


def db_fetchall(table: str,
                select_item: list,
                columns: list,
                operators: list
                ) -> dict:
    """Perform a SELECT from the database with given parameters:
        table name, item to look for, columns to search in and
        parameters to look for in these columns"""
    query_string = query_select(table, select_item, columns)
    db = get_db()
    cursor = db.cursor()
    cursor.execute(query_string, operators)
    result = cursor.fetchall()
    # db.close()
    return result

# TODO: check how to log multiple data
def db_insert(table: str,
              columns: list,
              data_items: list,
              log: list = None
              ) -> None:
    """Insert a set of data into the relevant table"""
    query_string = query_insert(table, columns)
    db = get_db()
    cursor = db.cursor()
    for data in data_items:
        cursor.execute(query_string, data)
        last_id = cursor.lastrowid
        if log:
            db_log(*log, relative=last_id)
    db.commit()
    # db.close()


def db_log(identifier: str,         # what is the object logged identifier
           type: str,               # what is the type of object (user, item)
           current: str,            # current status (pending, active)
           action: str,             # action performed (approve, update)
           by: str,                 # user performing the action identifier
           next: str,               # who is next in line for this action
           external: bool = True,   # True if called from another INSERT db function
           relative: int = None,    # the id of the action in the relevant database
           table: str = "history"   # log data table. default "history" table
           ) -> None:
    """Log actions in database for reference"""
    query_string = f"""INSERT INTO {table}
                        (identifier, type, current, created, action, by, next, relative)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?);"""
    current_datetime = datetime.datetime.now()
    created = current_datetime.strftime("%Y-%m-%d %H:%M:%S")
    # Format it as YYYY-MM-DD HH:MM:SS
    db = get_db()
    cursor = db.cursor()
    print("IN LOG", external)
    cursor.execute(query_string, (identifier, type, current, created, action, by, next, relative))
    if not external:
        print("LOG COMMIT")
        print("query: ", query_string, identifier, type, current, created, action, by, next, relative)
        db.commit()
        # db.close()


def db_set(table: str,
           columns: list,
           values: list,
           condition_value: str,
           condition_key: str = "id",
           log: list = None,
           if_exists: bool = False
           ) -> None:
    if if_exists:
        columns.insert(0, condition_key)
        values.insert(0, condition_value)
        query_string = query_set_if_exists(table, columns, values)
    else:
        query_string = query_set(table, columns, values)
        query_string = query_string + f"{condition_key} = {condition_value};"
    db = get_db()
    cursor = db.cursor()
    print("query string: ", query_string)
    cursor.execute(query_string)
    if log:
        print("LOGGING")
        relative = None
        if condition_key == "id":
            relative = condition_value
            print("relative: ", relative)
        db_log(*log, relative=relative)
    db.commit()
    print("COMMIT")
    # db.close()


def db_join(leading_table: str,
            joined_table: str,
            selected_main: list,
            selected_join: list,
            join: list,
            columns: list,
            numbered: str,
            operators: list
            ) -> None:
    query_string = query_join(leading_table,
                              joined_table,
                              selected_main,
                              selected_join,
                              join,
                              columns,
                              numbered)
    db = get_db()
    cursor = db.cursor()
    cursor.execute(query_string, operators)
    result = cursor.fetchall()
    return result


def db_maxSKU() -> int:
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT MAX(CAST(SKU AS INTEGER)) FROM itemsbasic;")
    result = cursor.fetchone()
    return int(result[0]) if result and result[0] is not None else None
