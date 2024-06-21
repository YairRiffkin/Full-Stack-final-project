// Update user page validation - mostly uses the register functions

import { NewUser } from "../../models/usertypes";
import { UserNameValid, EmployeeIdValid, EmailValid, SelectValid, PasswordValid, PasswordVerify } from "./RegistrationValidateFunctions";



export function CheckUserUpdateInputLine(name: string, value: string, value1: string) {
  let warning: string[] = [];
  if (name === "username") {
    warning = UserNameValid(value);}
  if (name === "employee_id") {
    warning = EmployeeIdValid(value);}
  if (name === "email") {
    warning = EmailValid(value);}
  if (name === "role" || name === "location") {
    warning = SelectValid(value);}
  if (name === "password1") {
    warning = PasswordValid(value);}
  if (name === "password2") {
    warning = PasswordVerify(value, value1);}
  return warning;
}

export function CheckUpdateUserComplete(form: NewUser, warnings: string[], passwordUpdate: boolean) {
  /* checks the specific form is complete */
  let result: boolean = false;
  warnings.map((warning) => {
    if (warning !== "") { result = true; }
  });
  const formCheck = Object.keys(form).some((key) => {
    if (!passwordUpdate && (key === "password1" || key === "password2")) {
      return false
    }
    return form[key] === null || form[key] === undefined || form[key] === '';
  })
  return result || formCheck;
}




