# handle the final data configuration

accounting_data_elements = {
    # list of standard requirements
    "Material Number": {"Field Description": "Material Number", "Group Name": "Key", "Importance": "mandatory for sheet", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "0", "reference": "SKU"},
    "Valuation area": {"Field Description": "Valuation area", "Group Name": "Key", "Importance": "mandatory for sheet", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "0", "reference": "plant"},
    "Valuation Category": {"Field Description": "Valuation Category", "Group Name": "Accounting 1 - General Valuation Data", "Importance": "", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "C", "reference": "0"},
    "Valuation Class": {"Field Description": "Valuation Class", "Group Name": "Accounting 1 - General Valuation Data", "Importance": "mandatory for sheet", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "7771", "reference": "0"},
    "Mat. Led. mat. level": {"Field Description": "Material ledger activated at mat. level", "Group Name": "Accounting 1 - General Valuation Data", "Importance": "", "Type": "Text", "Length": 1     , "Decimal": 0, "default": "X", "reference": "0"},
    "MPD: Control": {"Field Description": "Material Price Determination: Control", "Group Name": "Accounting 1 - General Valuation Data", "Importance": "", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "2", "reference": "0"},
    "Price cont. ind.": {"Field Description": "Price control indicator", "Group Name": "Accounting 1 - Prices and values", "Importance": "mandatory for sheet", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "V", "reference": "0"},
    "Moving average price": {"Field Description": "Moving average price", "Group Name": "Accounting 1 - Prices and values", "Importance": "", "Type": "Number", "Length": 11    , "Decimal": 2     , "default": "0.01", "reference": "0"},
    "Price unit": {"Field Description": "Price unit", "Group Name": "Accounting 1 - Prices and values", "Importance": "", "Type": "Number", "Length": 5     , "Decimal": 0, "default": "1", "reference": "0"},
    "Future price": {"Field Description": "Future price", "Group Name": "Accounting 1 - Prices and values", "Importance": "", "Type": "Number", "Length": 11    , "Decimal": 2     , "default": "0", "reference": "0"}
    }


def final_accounting_schema() -> str:
    # Schema string for creating DB
    schema_string_basic = "CREATE TABLE IF NOT EXISTS final_accounting_data ("
    id_line = "id INTEGER PRIMARY KEY NOT NULL"
    schema_string_basic = schema_string_basic + id_line
    for column in accounting_data_elements:
        add_comma = ", "
        line_string = f'"{column}"'
        column_type = ""
        required = ""
        default = ""
        add_quotes = ""
        if accounting_data_elements[column]["Type"] == "Number":
            if accounting_data_elements[column]["Decimal"] == 0:
                column_type = " INTEGER"
            else:
                column_type = " REAL"
        else:
            column_type = " TEXT"
            add_quotes = "'"
        if accounting_data_elements[column]["Importance"] == "mandatory for sheet":
            required = " NOT NULL"
        if accounting_data_elements[column]["default"] != "":
            default = " DEFAULT " + f"{add_quotes + accounting_data_elements[column]['default'] + add_quotes}"
        line_string = add_comma + line_string + column_type + required + default
        schema_string_basic = schema_string_basic + line_string
    schema_string_basic = schema_string_basic + ");"
    return schema_string_basic
