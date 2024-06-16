# Arrange data based on user inputs into standard format and configuration

from .FinalBasic import basic_table_elements
from .FinalPlantData import plant_data_elements
from .FinalMaterialData import material_description_elements
from .FinalStorageData import storage_data_elements
from .FinalAccountingData import accounting_data_elements
from .FinalLongTextData import long_text_elements
from .FinalExpansionLTMC import expansion_LTMC_elements

table_list = {
    "Basic": basic_table_elements,
    "Plant": plant_data_elements,
    "Material": material_description_elements,
    "Storage": storage_data_elements,
    "Accounting": accounting_data_elements,
    "Long Text": long_text_elements,
    "Expansion LTMC": expansion_LTMC_elements
}


def check_error(items: list) -> list:
    """Checks for errors in the process of data input

    Args:
        items (list): Items that have been approved and are in "final" status

    Returns:
        list: errors if exist, None if not
    """
    error = []
    sku = []
    part_number = []
    add_comma = ""
    # for this project only testing for duplicate key indicators
    error_string1 = "There are duplicate SKU's: "
    error_string2 = "There are duplicate manufacturer part number: "
    sku_error = error_string1
    num_error = error_string2
    for item in items:
        this_sku = item["SKU"]
        this_number = item["man_part_num"]
        if this_sku in sku:
            sku_error = sku_error + add_comma + this_sku
        if this_number in part_number:
            num_error = num_error + add_comma + this_number
        sku.append(this_sku)
        part_number.append(this_number)
        add_comma = ", "
    if sku_error != error_string1:
        error.append(sku_error)
    if num_error != error_string2:
        error.append(num_error)
    return error


def update_data(items: list, table: str) -> list:
    """Create a list for display resembling the future excel result

    Args:
        items (list): Items that have been approved and are in "final" status
        table (str): the table to create
    Returns:
        list: list of headers and details according to the standard + errors if exist
    """
    update_table = table_list[table]
    headers = []
    return_list = []
    error = []
    for detail in update_table:
        # The full long text header for the attribute
        # A list in the desired order to be displayed in the front end
        headers.append(update_table[detail]["Field Description"])
    for item in items:
        line = {}
        for detail in update_table:
            # column header
            header = update_table[detail]["Field Description"]
            # the reference cell in the itemsbasic DB
            reference = update_table[detail]["reference"]
            # A default value, if exists
            default = update_table[detail]["default"]
            # Data type (text, number)
            type = update_table[detail]["Type"]
            # decimals if the number is not integer
            decimal = update_table[detail]["Decimal"]
            if type == "Number":
                # if no reference and no default set a number to 0
                data = 0
                if reference != "0":
                    data = item[reference]
                elif default != "0":
                    data = default
                if decimal > 0:
                    data = float(data)
                    data = round(data, decimal)
                    data = f"{data:.3f}"
                else:
                    data = int(data)
            elif type == "Text":
                # if no reference and no default set text to empty string
                data = ""
                if reference != "0":
                    data = item[reference]
                elif default != "0":
                    data = default
            line.update({header: data})
        return_list.append(line)
    error = check_error(items)
    return [headers, return_list, error]
