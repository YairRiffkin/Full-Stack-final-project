
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
    """Create INSERT command to database:
        INSERT INTO table ({colum1, column2,..}) VALUES (?, ?, ...);
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


def query_set(table: str, columns: list, values: list) -> str:
    """Create SET command to database:
        UPDATE table
        SET column1 = value1, column2 = value2, ...
        WHERE condition;
    """
    add_comma = ""
    result = f"UPDATE {table} SET "
    for column, value in zip(columns, values):
        result = result + add_comma + column + " = '" + value + "'"
        add_comma = ", "
    result = result + " WHERE "
    return result


def query_set_if_exists(table: str, columns: list, values: list) -> str:
    """Create SET command to database - if identifier column exists it updates the value, if not it creates a new row:
        INSERT INTO your_table_name (column1 {identifier}, column2, ...)
        VALUES (value1, value2, ...)
        ON CONFLICT(column1) DO UPDATE SET
        column2 = excluded.column2,
        ... ,
    """
    add_comma = ""
    result = f"INSERT INTO {table} ("
    for column in columns:
        result = result + add_comma + column
        add_comma = ", "
    result = result + ") VALUES ("
    add_comma = ""
    for value in values:
        result = result + add_comma + value
        add_comma = ", "
    result = result + F") ON CONFLICT ({columns[0]}) DO UPDATE SET "
    add_comma = ""
    for column in columns[1:]:
        result = result + add_comma + f"{column} = excluded.{column}"
        add_comma = ", "
    result = result + ";"
    return result
