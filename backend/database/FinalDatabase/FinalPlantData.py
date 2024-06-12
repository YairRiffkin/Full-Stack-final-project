
plant_data_elements = {
    "Material Number": {"Field Description": "Material Number", "Group Name": "Key", "Importance": "mandatory for sheet", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "0", "reference": "SKU"},
    "Plant": {"Field Description": "Plant", "Group Name": "Key", "Importance": "mandatory for sheet", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "0", "reference": "plant"},
    "Material Views": {"Field Description": "Material Views", "Group Name": "Administrative Data", "Importance": "", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "X", "reference": "0"},
    "Availability Check": {"Field Description": "Checking Group for Availability Check", "Group Name": "Multiple View Data", "Importance": "", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "2", "reference": "0"},
    "Goods pr. time days": {"Field Description": "Goods receipt processing time in days", "Group Name": "Multiple View Data", "Importance": "", "Type": "Number", "Length": 3     , "Decimal": 0, "default": "0", "reference": "0"},
    "Shipping setup time": {"Field Description": "Shipping setup time", "Group Name": "Sales General/Plant - Shipping Data (times in days)", "Importance": "", "Type": "Number", "Length": 5     , "Decimal": 2     , "default": "0", "reference": "0"},
    "Shipping pr. time": {"Field Description": "Shipping processing time", "Group Name": "Sales General/Plant - Shipping Data (times in days)", "Importance": "", "Type": "Number", "Length": 5     , "Decimal": 2     , "default": "0", "reference": "0"},
    "Basefor cap. Plann.": {"Field Description": "Base quantity for capacity planning", "Group Name": "Sales General/Plant - Shipping Data (times in days)", "Importance": "", "Type": "Number", "Length": 13    , "Decimal": 3     , "default": "0", "reference": "0"},
    "Profit Center": {"Field Description": "Profit Center", "Group Name": "Sales General/Plant - Parameters", "Importance": "", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "0", "reference": "profit_center"},
    "Purchasing group": {"Field Description": "Purchasing group", "Group Name": "Purchasing - General Data", "Importance": "", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "0", "reference": "purch_group"},
    "Auto purch. allowed": {"Field Description": "Automatic purchase order allowed", "Group Name": "Purchasing - General Data", "Importance": "", "Type": "Text", "Length": 1     , "Decimal": 0, "default": "X", "reference": "0"},
    "MRP Type": {"Field Description": "MRP Type", "Group Name": "MRP 1 - MRP procedure", "Importance": "", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "0", "reference": "mrp_type"},
    "Reorder Point": {"Field Description": "Reorder Point", "Group Name": "MRP 1 - MRP procedure", "Importance": "", "Type": "Number", "Length": 13    , "Decimal": 3     , "default": "1", "reference": "reorder_pnt"},
    "Planning time fence": {"Field Description": "Planning time fence", "Group Name": "MRP 1 - MRP procedure", "Importance": "", "Type": "Number", "Length": 3     , "Decimal": 0, "default": "0", "reference": "0"},
    "MRP controller": {"Field Description": "MRP controller", "Group Name": "MRP 1 - MRP procedure", "Importance": "", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "0", "reference": "controller"},
    "Lot sizing Procedure": {"Field Description": "Lot sizing Procedure", "Group Name": "MRP 1 - Lot size data", "Importance": "", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "HB", "reference": "0"},
    "Maximum Stock Level": {"Field Description": "Maximum Stock Level", "Group Name": "MRP 1 - Lot size data", "Importance": "", "Type": "Number", "Length": 13    , "Decimal": 3     , "default": "0", "reference": "max_stock"},
    "Fixed lot size": {"Field Description": "Fixed lot size", "Group Name": "MRP 1 - Lot size data", "Importance": "", "Type": "Number", "Length": 13    , "Decimal": 3     , "default": "0", "reference": "0"},
    "Rounding value": {"Field Description": "Rounding value", "Group Name": "MRP 1 - Lot size data", "Importance": "", "Type": "Number", "Length": 13    , "Decimal": 3     , "default": "0", "reference": "0"},
    "Procurement Type": {"Field Description": "Procurement Type", "Group Name": "MRP 2 - Procurement", "Importance": "", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "F", "reference": "0"},
    "Storage loc. for EP": {"Field Description": "Storage location for EP", "Group Name": "MRP 2 - Procurement", "Importance": "", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "0", "reference": "stor_loc"},
    "Plan del. time days": {"Field Description": "Planned delivery time in days", "Group Name": "MRP 2 - Scheduling", "Importance": "", "Type": "Number", "Length": 3     , "Decimal": 0, "default": "0", "reference": "delivery_time"},
    "Safety stock": {"Field Description": "Safety stock", "Group Name": "MRP 2 - Net requirements calculation", "Importance": "", "Type": "Number", "Length": 13    , "Decimal": 3     , "default": "0", "reference": "0"},
    "Minimum Safety Stock": {"Field Description": "Minimum Safety Stock", "Group Name": "MRP 2 - Net requirements calculation", "Importance": "", "Type": "Number", "Length": 13    , "Decimal": 3     , "default": "0", "reference": "0"},
    "Safety time": {"Field Description": "Safety time (in workdays)", "Group Name": "MRP 2 - Net requirements calculation", "Importance": "", "Type": "Number", "Length": 2     , "Decimal": 0, "default": "0", "reference": "0"},
    "Period Indicator": {"Field Description": "Period Indicator", "Group Name": "MRP 3 - Forecast Requirements", "Importance": "", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "MON", "reference": "0"},
    "Cons. Per.: backward": {"Field Description": "Consumption period: backward", "Group Name": "MRP 3 - Planning", "Importance": "", "Type": "Number", "Length": 3     , "Decimal": 0, "default": "0", "reference": "0"},
    "Cons. Per.: forward": {"Field Description": "Consumption period: forward", "Group Name": "MRP 3 - Planning", "Importance": "", "Type": "Number", "Length": 3     , "Decimal": 0, "default": "0", "reference": "0"},
    "Tot. repl. lead time": {"Field Description": "Total replenishment lead time in workday", "Group Name": "MRP 3 - Availability Check", "Importance": "", "Type": "Number", "Length": 3     , "Decimal": 0, "default": "0", "reference": "0"},
    "Dep. ind. ind./coll": {"Field Description": "Dependent requre. ind. for individu/coll", "Group Name": "MRP 4 - BOM explosion/dependent requirements", "Importance": "", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "2", "reference": "0"},
    "Comp. scrap in %": {"Field Description": "Component scrap in percent", "Group Name": "MRP 4 - BOM explosion/dependent requirements", "Importance": "", "Type": "Number", "Length": 5     , "Decimal": 2     , "default": "0", "reference": "0"},
    "Ind. for Req. Group": {"Field Description": "Indicator for Requirements Grouping", "Group Name": "MRP 4 - BOM explosion/dependent requirements", "Importance": "", "Type": "Text", "Length": 80    , "Decimal": 0, "default": "T", "reference": "0"}
    }


def final_plant_data_schema():
    schema_string_basic = "CREATE TABLE IF NOT EXISTS final_plant_data ("
    id_line = "id INTEGER PRIMARY KEY NOT NULL"
    schema_string_basic = schema_string_basic + id_line
    for column in plant_data_elements:
        add_comma = ", "
        line_string = f'"{column}"'
        column_type = ""
        required = ""
        default = ""
        add_quotes = ""
        if plant_data_elements[column]["Type"] == "Number":
            if plant_data_elements[column]["Decimal"] == 0:
                column_type = " INTEGER"
            else:
                column_type = " REAL"
        else:
            column_type = " TEXT"
            add_quotes = "'"
        if plant_data_elements[column]["Importance"] == "mandatory for sheet":
            required = " NOT NULL"
        if plant_data_elements[column]["default"] != "":
            default = " DEFAULT " + f"{add_quotes + plant_data_elements[column]['default'] + add_quotes}"
        line_string = add_comma + line_string + column_type + required + default
        schema_string_basic = schema_string_basic + line_string
    schema_string_basic = schema_string_basic + ");"
    return schema_string_basic
