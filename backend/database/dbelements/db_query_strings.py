
def query_select(table: str, select_item: list, columns: list) -> str:
    """"Create SELECT query from database:
        SELECT {colum1, column2,..} FROM table WHERE {col1 = ? AND col2 = ? AND...}"
    """
    add_comma = ""
    add_and = " "
    result = "SELECT"
    for item in select_item:
        result = result + f"{add_comma} {item}"
        add_comma = ","
    result = result + f" FROM {table} WHERE"
    for column in columns:
        result = result + f"{add_and}{column} = ? "
        add_and = "AND "
    return result


def query_insert(table: str, columns: list) -> str:
    """"Create INSERT command to database:
        INSERT INTO table ({colum1, column2,..}) VALUES (?, ?, ...);"
    """
    add_comma = ""
    parameter_sign = ""
    result = f"INSERT INTO {table} ("
    for column in columns:
        result = result + add_comma + column
        parameter_sign = parameter_sign + add_comma + "?"
        add_comma = ", "
    result = result + f") VALUES ({parameter_sign})"
    return result

# print(db_select("users", ["id"], ["username"]))