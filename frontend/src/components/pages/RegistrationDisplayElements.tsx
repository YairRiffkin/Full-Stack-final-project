import { FormDetail } from "../../models/formtypes";

export const LocationList: string[] = [
    "--Choose--", "Tzrifin", "Afula", "Gilboa", "Hadera", "Nahariya"
]

export const RoleList: string[] = [
    "--Choose--", "MRP Controller", "Warehouse Manager", "Engineer", "Mech. Maintenance", "Elec. Maintenance", "Other"
]

export const RegistrationFormDetails: FormDetail[] = [
    { element: "input", type: "text", maxLength: 30, options: null, name: "username", placeholder: "First name, Surname"},
    { element: "input", type: "text", maxLength: 6, options: null, name: "employee_id", placeholder: "Employee ID"},
    { element: "input", type: "email", maxLength: 40, options: null, name: "email", placeholder: "Email"},
    { element: "input", type: "tel", maxLength: 20, options: null, name: "phone_number", placeholder: "Phone Number"},
    { element: "select", type: "text", maxLength: null, options: LocationList, name: "location", placeholder: "Location"},
    { element: "select", type: "text", maxLength: null, options: RoleList, name: "role", placeholder: "Role"},
    { element: "input", type: "password", maxLength: 6, options: null, name: "password1", placeholder: "Password"},
    { element: "input", type: "password", maxLength: 6, options: null, name: "password2", placeholder: "Verify Password"}
]

export const UserNameWarning: string[] =[ 
"No spaces at beginning or end of line",
"Between name and surname use only one space",
"For multiple names connect using a dot or -."
]

export const EmployeeIdWarning: string[] =[ 
    "No spaces at beginning or end of line",
    "Must begin with E or T",
    "Rest of ID must consist exactly 5 numbers",
    "Id must be exactly 6 characters long"
    ]

export const EmailWarning: string[] =[ 
    "No spaces at beginning or end of line",
    "Must be valid email format",
    "Must be a valid xxx.com email",
    ]

export const PasswordWarning: string[] =[ 
    "No spaces at beginning or end of line",
    "Must contain at least: 1 capital letter, 1 lowercase letter & 1 digit",
    "Must be exactly 6 characters long",
    "Passwords do not match"
    ]



