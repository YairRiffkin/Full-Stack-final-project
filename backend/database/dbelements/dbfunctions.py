
from database.db import get_db
from database.dbelements.db_query_strings import query_insert, query_select


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
    user = cursor.fetchone()
    return user


def db_insert(table: str, columns: list, data_items: list) -> None:
    """Insert a set of data into the relevant table"""
    query_string = query_insert(table, columns)
    db = get_db()
    cursor = db.cursor()
    for data in data_items:
        print("string: ", query_string)
        print("data: ", data)
        cursor.execute(query_string, data)
    db.commit()
    db.close()
