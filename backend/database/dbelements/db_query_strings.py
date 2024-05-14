
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


def query_join(leading_table: str,
               joined_table: str,
               selected_main: list,
               selected_join: list,
               join: list,
               columns: list,
               numbered: str
               ) -> str:
    """Create SELECT - JOIN command to database:
        SELECT table.selected1, table.selected2...
        FROM leading_table
        JOIN joined_table ON main_table.join[0] = joined_table.join[1]
        WHERE columns1 = ? AND columns2 = ? AND ... ;
    """
    main = []
    joined = []
    for select in selected_main:
        main.append(leading_table + "." + select)
    for select in selected_join:
        joined.append(joined_table + "." + select)
    columns = [leading_table + "." + item for item in columns]
    numbered = leading_table + "." + numbered
    join[0] = leading_table + "." + join[0]
    join[1] = joined_table + "." + join[1]
    result = f" SELECT ROW_NUMBER() OVER (ORDER BY {numbered}) AS id, "
    add_comma = ""
    for item in main:
        result = result + add_comma + item
        add_comma = ", "
    for item in joined:
        result = result + add_comma + item
        add_comma = ", "
    result = result + f" FROM {leading_table}"
    result = result + f" JOIN {joined_table} ON {join[0]} = {join[1]} "
    result = result + "WHERE "
    add_and = ""
    for column in columns:
        result = result + add_and + f"{column} = ?"
        add_and = " AND "
    result = result + ";"
    return result
