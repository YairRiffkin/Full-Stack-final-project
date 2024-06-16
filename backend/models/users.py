from dataclasses import asdict, dataclass
import re
import phonenumbers as tel
from database.dbelements.dbfunctions import db_fetchone


@dataclass
class User:
    """A class to handle new and existing user attribute values"""
    id: int | None
    username: str | None
    employee_id: str | None
    email: str | None
    phone_number: str | None
    location: str | None
    role: str | None | None
    user_level: str | None

    # possible locations
    locations = ["Tzrifin", "Afula", "Gilboa", "Hadera", "Nahariya"]

    # possible roles
    roles = ["MRP Controller",
             "Warehouse Manager",
             "Engineer",
             "Mech. Maintenance",
             "Elec. Maintenance",
             "Other"
             ]

    # to match database headers to TYPE attributes
    database_columns = [
                        "username",
                        "employee_id",
                        "email",
                        "phone_number",
                        "location",
                        "role",
                        "user_level"
                        ]

    def check_name(self) -> list:
        """Check name is in correct format:
           1) No leading or lagging space.
           2) Name, space, Sirname.
           3) Multiple names connected with dot.

        Returns:
            list: errors if exist_
        """
        exceptions = []
        if self.username.count(" ") > 1:
            exceptions.append("username has more than 1 space")
        if not re.match(r"^[a-zA-Z\s.-]+$", self.username):
            exceptions.append("Names should contain only letters")
        return exceptions

    def check_employeeID(self) -> list:
        """Check ID if in correct format:
           1) Starts with an "E" or "T".
           2) No lagging or leading spaces
           3) Exactly 6 chr long with first letter and rest are digits.

        Returns:
            _type_: errors if exist
        """
        exceptions = []
        rest_of_string = self.employee_id[1:]
        if not (self.employee_id[0].upper() == "E" or self.employee_id[0].upper() == "T"):
            exceptions.append("Employee ID does not contain either E or T")
        if not re.match(r"^[0-9]+$", rest_of_string):
            exceptions.append("Employee ID does not consist only numbers")
        if len(self.employee_id) != 6:
            exceptions.append("Employee ID is not 6 characters long")
        return exceptions

    def check_email(self) -> list:
        """Check email is in correct format:
           1) Email format.
           2) No leading or lagging space.
           3) Company mail [xxx.com]

        Returns:
            list: errors if exist
        """
        exceptions = []
        email_format = True
        if "@" in self.email and self.email.count("@") == 1:
            split_string = self.email.split("@")
            dot_check = split_string[1].split(".")
            if any(len(element) == 0 for element in dot_check):
                email_format = False
            if self.email.count(" ") > 1:
                email_format = False
            elif "xxx" not in split_string[1]:
                email_format = False
            elif split_string[1].count(".") == 0:
                email_format = False
        else:
            email_format = False
        if not email_format:
            exceptions = ["Email is not in correct format"]
        return exceptions

    def check_phone_number(self) -> list:
        """Check phone number is correct:
           1) Is a valid number
           2) Is a possible number

        Returns:
            list: errors if exist
        """
        exceptions = []
        parsed_number = tel.parse(self.phone_number, "IL")
        possible = tel.is_possible_number(parsed_number)
        valid = tel.is_valid_number(parsed_number)
        if not (possible and valid):
            exceptions = ["Phone number incorrect"]
        return exceptions

    def check_user_details(self) -> dict:
        """Checks all details are correct and valid

        Returns:
            dict: errors if exist
        """
        exceptions = {}
        check_name = self.check_name()
        check_employeeID = self.check_employeeID()
        check_email = self.check_email()
        check_phone_number = self.check_phone_number()
        if check_name:
            exceptions["Name"] = check_name
        if check_employeeID:
            exceptions["Employee ID"] = check_employeeID
        if check_email:
            exceptions["Email"] = check_email
        if check_phone_number:
            exceptions["Phone number"] = check_phone_number
        if self.location not in self.locations:
            exceptions["Location"] = ["Location not valid"]
        if self.role not in self.roles:
            exceptions["Role"] = ["Role not valid"]
        return exceptions

    def beautify_user_data(self) -> dict:
        """Arranges details format to be standard

        Returns:
            dict: User with standard format
        """
        self.username = self.username.lower().title()
        self.employee_id = self.employee_id.upper()
        self.phone_number = tel.parse(self.phone_number, "IL")
        self.phone_number = tel.format_number(self.phone_number, tel.PhoneNumberFormat.NATIONAL)
        return self

    def user_is_duplicate(self) -> bool:
        """Checks if user exists -> key, unique parameters are email and employee ID

        Returns:
            bool: true: if exists
        """
        is_duplicate = False
        user = db_fetchone("users", ["id"], ["employee_id"], [self.employee_id])
        print("user= ", user, "self= ", self.employee_id)
        if user:
            is_duplicate = True
        user = db_fetchone("users", ["id"], ["email"], [self.email])
        print("user= ", user, "self= ", self.employee_id)
        if user:
            is_duplicate = True
        return is_duplicate

    def make_db_data(self, user_level: str, add_item: dict = None) -> list:
        """Arranges User data for DB insert

        Args:
            user_level (str): for logging
            add_item (dict, optional): If needed data that is not in TYPE. Defaults to None.

        Returns:
            list: User details
        """
        self.user_level = user_level
        class_dict = asdict(self)
        class_dict.pop("id")
        if add_item:
            class_dict.update(add_item)
        columns = list(class_dict.keys())
        data = list(class_dict.values())
        return [columns, data]

    def make_frontend_data(self) -> dict:
        """Makes list of User details for frontend display

        Returns:
            dict: User details
        """
        class_dict = asdict(self)
        class_dict.pop("id")
        return class_dict

    def make_update_data(self) -> list:
        """Manages update data - 
           dose not allow change to key details (employee ID & email)
           and not authorized change (user level).

        Returns:
            list: user details
        """
        class_dict = asdict(self)
        class_dict.pop("id", None)
        class_dict.pop("employee_id", None)
        class_dict.pop("email", None)
        class_dict.pop("user_level", None)
        columns = list(class_dict.keys())
        data = list(class_dict.values())
        return [columns, data]
