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

    locations = {"Afula": "4630",
                 "Nahariya": "4631",
                 "Hadera": "4632",
                 "Gilboa": "4643"
                 }

    cost_center = {"4630": "B27712",
                   "4631": "B27912",
                   "4632": "B27812",
                   "4643": "B28012"
                   }

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

    def check_space(self, item: str) -> list:
        error_string = "You have leading or lagging spaces"
        return [error_string, item.startswith(' ') or item.endswith(' ')]

    def check_required(self, attr: str, item: str) -> list:
        error_string = "Not all required fields are filled"
        required = self.parameters[attr]["required"]
        convert_item = item == "None" or item == ""
        return [error_string, required and convert_item]

    def check_costcenter(self, item: str) -> list:
        error_string = "Location and cost center don't match"
        not_match = self.profitCenter != self.cost_center[item]
        return [error_string, not_match]

    def check_item(self) -> list:
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
                error.append(check[0])
            if detail == "plant":
                check = self.check_costcenter(value)
                if check[1] and check[0] not in error:
                    error.append(check[0])
        return error

    def item_is_duplicate(self):
        is_duplicate = False
        item = db_fetchone("itemsbasic", ["id"], ["employee_id"], [self.employee_id])
        if item:
            is_duplicate = True
        item = db_fetchone("items", ["id"], ["email"], [self.email])
        if item:
            is_duplicate = True
        return is_duplicate

    def make_db_data(self, status: str) -> list:
        self.status = status
        class_dict = asdict(self)
        class_dict.pop("id")
        columns = self.database_columns
        data = list(class_dict.values())
        return [columns, data]
