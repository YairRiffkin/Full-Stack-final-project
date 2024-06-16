# handle the final data configuration

storage_data_elements = {
    # list of standard requirements
    "Material Number": {"Field Description": "Material Number", "Group Name": "Key", "Importance": "mandatory for sheet", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "0", "reference": "SKU"},
    "Plant": {"Field Description": "Plant", "Group Name": "Key", "Importance": "mandatory for sheet", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "0", "reference": "plant"},
    "Storage location": {"Field Description": "Storage location", "Group Name": "Key", "Importance": "mandatory for sheet", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "0", "reference": "stor_loc"},
    "Storage Bin": {"Field Description": "Storage Bin", "Group Name": "Plant Data / Stor. 1 - General data", "Importance": "", "Type": "Text", "Length": 10    , "Decimal": 0, "default": "0", "reference": "bin"}
    }


def final_storage_schema() -> str:
    # Schema string for creating DB
    schema_string_basic = "CREATE TABLE IF NOT EXISTS final_storage_data ("
    id_line = "id INTEGER PRIMARY KEY NOT NULL"
    schema_string_basic = schema_string_basic + id_line
    for column in storage_data_elements:
        add_comma = ", "
        line_string = f'"{column}"'
        column_type = ""
        required = ""
        default = ""
        add_quotes = ""
        if storage_data_elements[column]["Type"] == "Number":
            if storage_data_elements[column]["Decimal"] == 0:
                column_type = " INTEGER"
            else:
                column_type = " REAL"
        else:
            column_type = " TEXT"
            add_quotes = "'"
        if storage_data_elements[column]["Importance"] == "mandatory for sheet":
            required = " NOT NULL"
        if storage_data_elements[column]["default"] != "":
            default = " DEFAULT " + f"{add_quotes + storage_data_elements[column]['default'] + add_quotes}"
        line_string = add_comma + line_string + column_type + required + default
        schema_string_basic = schema_string_basic + line_string
    schema_string_basic = schema_string_basic + ");"
    return schema_string_basic
