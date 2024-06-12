
expansion_LTMC_elements = {
    "Material Number": {"Field Description": "Material Number", "Group Name": "Key", "Importance": "mandatory for sheet", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "0", "reference": "SKU"},
    "Language Key": {"Field Description": "Language Key", "Group Name": "Mandatory", "Importance": "mandatory for sheet", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "HE", "reference": "0"},
    "Material description": {"Field Description": "Material description", "Group Name": "Mandatory", "Importance": "mandatory for sheet", "Type": "Text", "Length": 40    , "Decimal": 0, "default": "0", "reference": "short_hebrew"},
    "Industry sector": {"Field Description": "Industry sector", "Group Name": "Mandatory", "Importance": "mandatory for sheet", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "K", "reference": "0"},
    "Material type": {"Field Description": "Material type", "Group Name": "Mandatory", "Importance": "mandatory for sheet", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "0", "reference": "mat_type"},
    "Material Views": {"Field Description": "Material Views", "Group Name": "Administrative Data", "Importance": "", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "X", "reference": "0"},
    "Material Group": {"Field Description": "Material Group", "Group Name": "Basic 1 - General Data", "Importance": "", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "0", "reference": "mat_group"},
    "Base Unit of Measure": {"Field Description": "Base Unit of Measure (ISO format)", "Group Name": "Basic 1 - General Data", "Importance": "mandatory for sheet", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "0", "reference": "unit_of_measure"},
    "Old material number": {"Field Description": "Old material number", "Group Name": "Basic 1 - General Data", "Importance": "", "Type": "Text", "Length": 40    , "Decimal": 0, "default": "0", "reference": "old_number"},
    "Division": {"Field Description": "Division", "Group Name": "Basic 1 - General Data", "Importance": "", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "01", "reference": "0"},
    "Gross Weight": {"Field Description": "Gross Weight", "Group Name": "Basic 1 - Dimensions/EANs", "Importance": "", "Type": "Number", "Length": 13    , "Decimal": 3     , "default": "0", "reference": "0"},
    "Net Weight": {"Field Description": "Net Weight", "Group Name": "Basic 1 - Dimensions/EANs", "Importance": "", "Type": "Number", "Length": 13    , "Decimal": 3     , "default": "0.001", "reference": "net_weight"},
    "Unit of Weight": {"Field Description": "Unit of Weight", "Group Name": "Basic 1 - Dimensions/EANs", "Importance": "", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "KG", "reference": "0"},
    "Volume": {"Field Description": "Volume", "Group Name": "Basic 1 - Dimensions/EANs", "Importance": "", "Type": "Number", "Length": 13    , "Decimal": 3     , "default": "0", "reference": "0"},
    "Length": {"Field Description": "Length", "Group Name": "Basic 1 - Dimensions/EANs", "Importance": "", "Type": "Number", "Length": 13    , "Decimal": 3     , "default": "0", "reference": "0"},
    "Width": {"Field Description": "Width", "Group Name": "Basic 1 - Dimensions/EANs", "Importance": "", "Type": "Number", "Length": 13    , "Decimal": 3     , "default": "0", "reference": "0"},
    "Height": {"Field Description": "Height", "Group Name": "Basic 1 - Dimensions/EANs", "Importance": "", "Type": "Number", "Length": 13    , "Decimal": 3     , "default": "0", "reference": "0"},
    "Mnfct Part Number": {"Field Description": "Manufacturer Part Number", "Group Name": "Purchasing - General Data", "Importance": "", "Type": "Text", "Length": 40    , "Decimal": 0, "default": "0", "reference": "man_part_num"},
    "Manufacturer number": {"Field Description": "Manufacturer number", "Group Name": "Purchasing - General Data", "Importance": "", "Type": "Text", "Length": 10    , "Decimal": 0, "default": "0", "reference": "manufacturer_num"},
    "Number GR/GI slips": {"Field Description": "Number of GR/GI slips to be printed", "Group Name": "Plant Data / Storage 1", "Importance": "", "Type": "Number", "Length": 13    , "Decimal": 3     , "default": "0", "reference": "0"},
    "Min. Remaining Life": {"Field Description": "Minimum Remaining Shelf Life", "Group Name": "Plant Data / Storage 1 - Shelf life data", "Importance": "", "Type": "Number", "Length": 4     , "Decimal": 0, "default": "0", "reference": "0"},
    "Total shelf life": {"Field Description": "Total shelf life", "Group Name": "Plant Data / Storage 1 - Shelf life data", "Importance": "", "Type": "Number", "Length": 4     , "Decimal": 0, "default": "0", "reference": "0"},
    "Storage percentage": {"Field Description": "Storage percentage", "Group Name": "Plant Data / Storage 1 - Shelf life data", "Importance": "", "Type": "Number", "Length": 3     , "Decimal": 0, "default": "0", "reference": "0"}
    }


def final_expansion_schema():
    schema_string_basic = "CREATE TABLE IF NOT EXISTS final_expansion_LTMC ("
    id_line = "id INTEGER PRIMARY KEY NOT NULL"
    schema_string_basic = schema_string_basic + id_line
    for column in expansion_LTMC_elements:
        add_comma = ", "
        line_string = f'"{column}"'
        column_type = ""
        required = ""
        default = ""
        add_quotes = ""
        if expansion_LTMC_elements[column]["Type"] == "Number":
            if expansion_LTMC_elements[column]["Decimal"] == 0:
                column_type = " INTEGER"
            else:
                column_type = " REAL"
        else:
            column_type = " TEXT"
            add_quotes = "'"
        if expansion_LTMC_elements[column]["Importance"] == "mandatory for sheet":
            required = " NOT NULL"
        if expansion_LTMC_elements[column]["default"] != "":
            default = " DEFAULT " + f"{add_quotes + expansion_LTMC_elements[column]['default'] + add_quotes}"
        line_string = add_comma + line_string + column_type + required + default
        schema_string_basic = schema_string_basic + line_string
    schema_string_basic = schema_string_basic + ");"
    return schema_string_basic
