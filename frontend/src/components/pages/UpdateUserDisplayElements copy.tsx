import { FormDetail } from "../../models/formtypes";
import { LocationList, RoleList } from "./RegistrationDisplayElements";

export const UpdateUserFormDetails: FormDetail[] = [
    { element: "input", type: "text", maxLength: 30, options: null, name: "username", placeholder: "First name, Surname"},
    { element: "input", type: "tel", maxLength: 20, options: null, name: "phone_number", placeholder: "Phone Number"},
    { element: "select", type: "text", maxLength: null, options: LocationList, name: "location", placeholder: "Location"},
    { element: "select", type: "text", maxLength: null, options: RoleList, name: "role", placeholder: "Role"},
    { element: "input", type: "password", maxLength: 6, options: null, name: "password1", placeholder: "Password"},
    { element: "input", type: "password", maxLength: 6, options: null, name: "password2", placeholder: "Verify Password"}
]

export const UpdatePasswordWarning: string[] =[ 
    "No spaces at beginning or end of line",
    "Must contain at least: 1 capital letter, 1 lowercase letter & 1 digit",
    "Must be exactly 6 characters long",
    "Passwords do not match"
    ]



