// Checks frontend valid inputs before subbmision to reduce server load
import { NewUser } from "../../models/usertypes";
import { EmailWarning, EmployeeIdWarning, PasswordWarning, RegistrationFormDetails, UserNameWarning } from "../pages/RegistrationDisplayElements";

export function UserNameValid(username: string) {
  /*
  1) No leading or lagging spaces.
  2) Multiple names connected with dot.
  3) 1 space between first and sir names.
  */
  const warning: string[] = [];
    if (username) {
      const trimmedName = username.trim();
      if (username !== trimmedName) { warning.push(UserNameWarning[0]) } 
      if (username.split(" ").length !== 2) { warning.push(UserNameWarning[1], UserNameWarning[2]) }
    }
  return warning
}

export function EmployeeIdValid(employee_id: string) {
  /*
   1) No leading or lagging spaces.
   2) Starts with E or T.
   3) exactly 6 characters -> letter + 5 digits
   */
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
  /*
  1) No leading or lagging spaces.
  2) Email format.
  3) Company mail -> xxx.com
  */
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
  /*
  1) No leading or lagging spaces.
  2) exactly 6 characters long.
  3) At least: 1 capital, 1 small, 1 digit
  */
  const warning: string[] = [];
  const trimmedName = password.trim();
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

    if (password !== trimmedName) { warning.push(PasswordWarning[0]); }
    if (!passwordRegex.test(password)) { warning.push(PasswordWarning[1]); }
    if (trimmedName.length !== 6) { warning.push(PasswordWarning[2]); }

  return warning
}

export function SelectValid(select: string){
  /*
  1) Not choosing a select option is an error
  */
  const warning: string[] = [];

    if (select === "--Choose--") { warning.push("You must choose an option") }
    
  return warning
}

export function PasswordVerify(password1: string, password2: string){
  /* Both passwords are the same */
  const warning: string[] = [];

    if (password1 !== password2) { warning.push(PasswordWarning[3]) }

  return warning
}

export function CheckInputLine(name: string, value: string, value1: string) {
  /* Goes through all the details for validation */
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
  /* Checks all details are filled */
  let result: boolean = false;
  warnings.map((warning) => {
    if (warning !== "") { result = true; }
  });
  const formCheck: boolean = !Object.values(form).every(value =>  value !== null && 
                                                                  value !== undefined  && 
                                                                  value !== '');
  
  return result || formCheck;
}

export function SetDefaultWarning(warnings: string[]) {
  /*Default warning list to allow showing errors at first render */
  RegistrationFormDetails.map((detail, index) => {
    (detail.element === "select") ? (warnings[index] = "You must choose an option") : null;
  });
  return warnings;
}

export function RegisterIssues(error: string[]) {
  /* Display backend errors*/
  const detailsList: string[] = [];
  const itemList: string[] = [];
  for (const key in error) {
      itemList.push(key);
      for (const detail in error[key] as unknown as string[]) {
          detailsList.push(error[key][detail]);
      }
  }
  return  <small>Please address the below issues before submitting
            <ol>
              { itemList.map((item) => (
                  <li>{ item }: 
                    <ul>
                      {detailsList.map((detail) => (
                        <li>{ detail }</li>
                      ))}
                    </ul>
                  </li>
              ))}
            </ol>
          </small>
}

export function  WarningDisplay(warnings: string | null) {
  /* Display errors */
  if (warnings) {
    const splitWarning = warnings.split(",");
    return (
      <>
        {splitWarning.map((warning, index) => (
          <p key={index}>
          <small>{ warning }. </small><br />
          </p>
   ) )}
      </>
    );
  } else {
    return null;
  }
}