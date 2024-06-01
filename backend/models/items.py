from dataclasses import asdict, dataclass
from database.dbelements.dbfunctions import db_fetchone


@dataclass
class Item:
    """A class to handle new and existing item attribute values"""
    id: int | None
    materialNumber: str | None
    shortHebrewDescription: str | None
    longHebrewDescription: str | None
    materialType: str | None
    baseUnitOfMeasure: str | None
    oldMaterialNumber: str | None
    materialGroup: str | None
    netWeight: str | None
    orderUnit: str | None
    purchasingGroup: str | None
    manufacturerNumber: str | None
    manufacturerPartNumber: str | None
    plant: str | None
    storageLocation: str | None
    storageBin: str | None
    profitCenter: str | None
    mrpType: str | None
    reorderPoint: str | None
    mrpController: str | None
    maximumStockLevel: str | None
    plannedDeliveryTimeInDays: str | None
    shortEnglishDescription: str | None
    longEnglishDescription: str | None
    supplierNumber: str | None
    supplierName: str | None
    standardPrice: str | None
    currency: str | None
    supplierPartNumber: str | None
    quotationNumber: str | None
    quotationDate: str | None
    status: str = "pending"

    # Possible locations of item handlers
    locations = {"Afula": "4630",
                 "Nahariya": "4631",
                 "Hadera": "4632",
                 "Gilboa": "4643"
                 }

    # Corresponding cost centers
    cost_center = {"4630": "B27712",
                   "4631": "B27912",
                   "4632": "B27812",
                   "4643": "B28012"
                   }

    # Standard characteristics for item data attributes
    parameters = {
        "materialNumber": {"maxlength": 8, "required": False},
        "shortHebrewDescription": {"maxlength": 40, "required": False},
        "longHebrewDescription": {"maxlength": 80, "required": False},
        "materialType": {"maxlength": 80, "required": True},
        "baseUnitOfMeasure": {"maxlength": 80, "required": True},
        "oldMaterialNumber": {"maxlength": 40, "required": False},
        "materialGroup": {"maxlength": 80, "required": True},
        "netWeight": {"maxlength": 80, "required": False},
        "orderUnit": {"maxlength": 80, "required": True},
        "purchasingGroup": {"maxlength": 80, "required": True},
        "manufacturerNumber": {"maxlength": 10, "required": True},
        "manufacturerPartNumber": {"maxlength": 40, "required": True},
        "plant": {"maxlength": 80, "required": True},
        "storageLocation": {"maxlength": 80, "required": True},
        "storageBin": {"maxlength": 10, "required": False},
        "profitCenter": {"maxlength": 80, "required": True},
        "mrpType": {"maxlength": 80, "required": True},
        "reorderPoint": {"maxlength": 13, "required": True},
        "mrpController": {"maxlength": 80, "required": True},
        "maximumStockLevel": {"maxlength": 13, "required": True},
        "plannedDeliveryTimeInDays": {"maxlength": 80, "required": True},
        "shortEnglishDescription": {"maxlength": 40, "required": True},
        "longEnglishDescription": {"maxlength": 80, "required": True},
        "supplierNumber": {"maxlength": 80, "required": True},
        "supplierName": {"maxlength": 80, "required": True},
        "standardPrice": {"maxlength": 11, "required": True},
        "currency": {"maxlength": 80, "required": True},
        "supplierPartNumber": {"maxlength": 80, "required": True},
        "quotationNumber": {"maxlength": 80, "required": True},
        "quotationDate": {"maxlength": 80, "required": True}
    }

    # The corresponding database column headers for transfer of data
    database_columns = ["SKU",
                        "short_hebrew",
                        "long_hebrew",
                        "mat_type",
                        "unit_of_measure",
                        "old_number",
                        "mat_group",
                        "net_weight",
                        "order_unit",
                        "purch_group",
                        "manufacturer_num",
                        "man_part_num",
                        "plant",
                        "stor_loc",
                        "bin",
                        "profit_center",
                        "mrp_type",
                        "reorder_pnt",
                        "controller",
                        "max_stock",
                        "delivery_time",
                        "short_english",
                        "long_english",
                        "supplier_num",
                        "sup_name",
                        "std_price",
                        "currency",
                        "sup_part_num",
                        "quote_num",
                        "quote_date",
                        "status"
                        ]

    def check_space(self, detail: str) -> list[str, bool]:
        """Leading or lagging spaces not allowed
        Args:
            detail (str): Item detail to be checked

        Returns:
            list: error, if exists and boolean result
        """
        error_string = "You have leading or lagging spaces"
        return [error_string, detail.startswith(' ') or detail.endswith(' ')]

    def check_required(self, attr: str, detail: str) -> list[str, bool]:
        """All required fields should have data
        Args:
            attr (str): Item attribute
            detail (str): Attribute data
        Returns:
            list: error, if exists and boolean result
        """
        error_string = "Not all required fields are filled"
        # Refers to required attribute list in the class definition
        required = self.parameters[attr]["required"]
        convert_item = detail == "None" or detail == ""
        return [error_string, required and convert_item]

    def check_costcenter(self, detail: str) -> list[str, bool]:
        """Cost center must match location
        Args:
            detail (str): Attribute data

        Returns:
            list: error, if exists and boolean result
        """
        error_string = "Location and cost center don't match"
        not_match = self.profitCenter != self.cost_center[detail]
        return [error_string, not_match]

    def check_item(self) -> list:
        """Check details validity
        Check all attribute of Item to be compliant with standard

        Returns:
            list: errors, if exist
        """
        error = []
        for detail in self.__annotations__:
            if detail == "id" or detail == "status" or detail == "materialNumber":
                continue
            value = str(getattr(self, detail))
            check = self.check_space(value)
            if check[1] and check[0] not in error:
                error.append(check[0])
            check = self.check_required(str(detail), value)
            if check[1] and check[0] not in error:
                print("detail: ", detail)
                error.append(check[0])
            if detail == "plant":
                check = self.check_costcenter(value)
                if check[1] and check[0] not in error:
                    error.append(check[0])
        return error

    def item_is_duplicate(self) -> bool:
        """If item has duplicate
        Item uniqueness is just by manufacturer part number from same supplier number.
        Returns:
            bool: True or False
        """
        is_duplicate = False
        item = db_fetchone("itemsbasic", ["id"], ["man_part_num", "supplier_num"], [self.manufacturerPartNumber, self.supplierNumber])
        print("duplicate item", item)
        if item:
            is_duplicate = True
        return is_duplicate

    def make_db_data(self, status: str) -> list:
        """Prepares data in database format.
        Args:
            status (str): status of item depending on action performed.

        Returns:
            list: 2 lists:
                columns -> for sqlite query of columns to update,
                data -> corresponding data.
        """
        self.status = status
        class_dict = asdict(self)
        class_dict.pop("id")
        columns = self.database_columns
        data = list(class_dict.values())
        return [columns, data]
