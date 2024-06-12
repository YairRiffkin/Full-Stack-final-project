
long_text_elements = {
    "Material Number": {"Field Description": "Material Number", "Group Name": "Key", "Importance": "mandatory for sheet", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "0", "reference": "SKU"},
    "Text ID": {"Field Description": "Text ID", "Group Name": "Key", "Importance": "mandatory for sheet", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "BEST", "reference": "0"},
    "Language Key": {"Field Description": "Language Key", "Group Name": "Key", "Importance": "mandatory for sheet", "Type": "Text", "Length": 8, "Decimal": 0, "default": "HE", "reference": "0"},
    "Language Key": {"Field Description": "Language Key", "Group Name": "Key", "Importance": "mandatory for sheet", "Type": "Text", "Length": 8, "Decimal": 0, "default": "EN", "reference": "0"},
    "Text": {"Field Description": "Text", "Group Name": "Text", "Importance": "mandatory for sheet", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "0", "reference": "long_hebrew"},
    "Text": {"Field Description": "Text", "Group Name": "Text", "Importance": "mandatory for sheet", "Type": "Text", "Length": 80, "Decimal": 0, "default": "0", "reference": "long_english"}
    }


def long_text_schema():
    schema_string_basic = "CREATE TABLE IF NOT EXISTS final_long_text ("
    id_line = "id INTEGER PRIMARY KEY NOT NULL"
    schema_string_basic = schema_string_basic + id_line
    for column in long_text_elements:
        add_comma = ", "
        line_string = f'"{column}"'
        column_type = ""
        required = ""
        default = ""
        add_quotes = ""
        if long_text_elements[column]["Type"] == "Number":
            if long_text_elements[column]["Decimal"] == 0:
                column_type = " INTEGER"
            else:
                column_type = " REAL"
        else:
            column_type = " TEXT"
            add_quotes = "'"
        if long_text_elements[column]["Importance"] == "mandatory for sheet":
            required = " NOT NULL"
        if long_text_elements[column]["default"] != "":
            default = " DEFAULT " + f"{add_quotes + long_text_elements[column]['default'] + add_quotes}"
        line_string = add_comma + line_string + column_type + required + default
        schema_string_basic = schema_string_basic + line_string
    schema_string_basic = schema_string_basic + ");"
    return schema_string_basic
