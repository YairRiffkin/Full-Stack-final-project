import { NewUser } from "../../models/usertypes";
import { EmailWarning, EmployeeIdWarning, PasswordWarning, RegistrationFormDetails, UserNameWarning } from "../pages/registrationform";

export function UserNameValid(username: string) {
  const warning: string[] = [];

    if (username) {
      const trimmedName = username.trim();
      if (username !== trimmedName) { warning.push(UserNameWarning[0]) } 
      if (username.split(" ").length !== 2) { warning.push(UserNameWarning[1], UserNameWarning[2]) }
    }
  
  return warning
}

export function EmployeeIdValid(employee_id: string) {
  const warning: string[] = [];
  const trimmedName = employee_id.trim();
  const firstLetter = trimmedName.charAt(0).toLowerCase();
  const restOfId = trimmedName.slice(1);

    if (employee_id !== trimmedName) { warning.push(EmployeeIdWarning[0]); }
    if (firstLetter !== "e" && firstLetter !== "t") { warning.push(EmployeeIdWarning[1]); }
    if (!/^[0-9]+$/.test(restOfId)) { warning.push(EmployeeIdWarning[2]); }
    if (trimmedName.length !== 6) { warning.push(EmployeeIdWarning[3]); }
  
  return warning
}

export function EmailValid (email: string) {
  const warning: string[] = [];
  const trimmedName = email.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (email !== trimmedName) { warning.push(EmailWarning[0]); }
    if (!emailRegex.test(email)) { warning.push(EmailWarning[1]) }
    if (emailRegex.test(email)) 
      { const domain = email.split('@')[1];
      if (domain !== "xxx.com") { warning.push(EmailWarning[2]) }
      }
  
  return warning
}

export function PasswordValid(password: string){
  const warning: string[] = [];
  const trimmedName = password.trim();
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

    if (password !== trimmedName) { warning.push(PasswordWarning[0]); }
    if (!passwordRegex.test(password)) { warning.push(PasswordWarning[1]); }
    if (trimmedName.length !== 6) { warning.push(PasswordWarning[2]); }

  return warning
}

export function SelectValid(select: string){
  const warning: string[] = [];

    if (select === "--Choose--") { warning.push("You must choose an option") }
    
  return warning
}

export function PasswordVerify(password1: string, password2: string){
  const warning: string[] = [];

    if (password1 !== password2) { warning.push(PasswordWarning[3]) }

  return warning
}

export function CheckInputLine(name: string, value: string, value1: string) {
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

export function CheckFormComplete(form: NewUser, warnings: string[]) {
  let result: boolean = false;
  warnings.map((warning) => {
    if (warning !== "") { result = true; }
  });
  const formCheck: boolean = !Object.values(form).every(value =>  value !== null && 
                                                                  value !== undefined  && 
                                                                  value !== '');
  console.log("result: ", result, "check: ", formCheck, "logic: ", result || formCheck)
  
  return result || formCheck;
}

export function SetDefaultWarning(warnings: string[]) {
  RegistrationFormDetails.map((detail, index) => {
    (detail.name === "role") ? (warnings[index] = "You must choose an option") : null;
    (detail.name === "location") ? (warnings[index] = "You must choose an option") : null;
  });
  return warnings;
}