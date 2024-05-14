import { NewUser } from "../../models/usertypes";
import { UserNameValid, EmployeeIdValid, EmailValid, SelectValid } from "./RegistrationValidateFunctions";



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
  // if (name === "password1") {
  //   warning = PasswordValid(value);}
  // if (name === "password2") {
  //   warning = PasswordVerify(value, value1);}
  console.log("check input line warning: ", warning)
  return warning;
}

export function CheckUpdateUserComplete(form: NewUser, warnings: string[]) {
  let result: boolean = false;
  warnings.map((warning) => {
    if (warning !== "") { result = true; }
  });
  const formCheck = Object.keys(form).some((key) => {
    if (key === "password1" || key === "password2") {
      return false
    }
    return form[key] === null || form[key] === undefined || form[key] === '';
  })
  return result || formCheck;
}




