# handle the final data configuration

material_description_elements = {
    # list of standard requirements
    "Material Number": {"Field Description": "Material Number", "Group Name": "Key", "Importance": "mandatory for sheet", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "0", "reference": "SKU"},
    "Language Key": {"Field Description": "Language Key", "Group Name": "Mandatory", "Importance": "mandatory for sheet", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "EN", "reference": "0"},
    "Material description": {"Field Description": "Material description", "Group Name": "Mandatory", "Importance": "mandatory for sheet", "Type": "Text", "Length": 40    , "Decimal": 0, "default": "0", "reference": "short_english"}
    }


def final_material_schema() -> str:
    # Schema string for creating DB
    schema_string_basic = "CREATE TABLE IF NOT EXISTS final_material_description ("
    id_line = "id INTEGER PRIMARY KEY NOT NULL"
    schema_string_basic = schema_string_basic + id_line
    for column in material_description_elements:
        add_comma = ", "
        line_string = f'"{column}"'
        column_type = ""
        required = ""
        default = ""
        add_quotes = ""
        if material_description_elements[column]["Type"] == "Number":
            if material_description_elements[column]["Decimal"] == 0:
                column_type = " INTEGER"
            else:
                column_type = " REAL"
        else:
            column_type = " TEXT"
            add_quotes = "'"
        if material_description_elements[column]["Importance"] == "mandatory for sheet":
            required = " NOT NULL"
        if material_description_elements[column]["default"] != "":
            default = " DEFAULT " + f"{add_quotes + material_description_elements[column]['default'] + add_quotes}"
        line_string = add_comma + line_string + column_type + required + default
        schema_string_basic = schema_string_basic + line_string
    schema_string_basic = schema_string_basic + ");"
    return schema_string_basic
