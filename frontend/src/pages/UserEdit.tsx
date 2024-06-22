// Each user can only change his details:
// key data is blocked for change (employee ID and email).
// Password change as an option

import { useEffect, useState } from "react";
import '../components/static/GeneralPage.css'
import { FormDetail } from "../models/formtypes";
import { RegisterIssues, WarningDisplay } from "../components/functions/RegistrationValidateFunctions";
import { NewUser, User } from "../models/usertypes";
import { useNavigate } from "react-router-dom";
import { RegistrationFormDetails } from "../components/pages/RegistrationDisplayElements";
import { CheckUpdateUserComplete, CheckUserUpdateInputLine } from "../components/functions/UpdateUserValidateFunctions";
import { UpdateHomeMessage, UpdatePassword } from "../components/pages/UpdateUserDisplayElements";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export type UserDataProps = { 
                            userDetails: User | null;
                            userToken: string | null;
                            }

export function UserEdit({ userDetails, userToken }: UserDataProps) {
  const formDetails: FormDetail[] = RegistrationFormDetails;
  const defaultForm = userDetails ? userDetails : null;
  const [registerForm, setRegisterForm] = useState<NewUser>({ username: defaultForm?.username || "",
                                                              employee_id: defaultForm?.employee_id || "",
                                                              email: defaultForm?.email || "",
                                                              location: defaultForm?.location || "--Choose--",
                                                              phone_number: defaultForm?.phone_number || "",
                                                              role: defaultForm?.role || "--Choose--",
                                                              password1: "",
                                                              password2: ""
                                                            })
  const [warnings, setWarnings] = useState<(string)[]>(Array(formDetails.length).fill(""));
  const [error, setError] = useState<string[] | null>(null)
  const [formComplete, setFormComplete] = useState<boolean>(true);
  const [passwordUpdate, setPasswordUpdate] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    setFormComplete(CheckUpdateUserComplete(registerForm, warnings, passwordUpdate));
  }, [error, passwordUpdate, registerForm, userDetails, warnings]);  
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const index = formDetails.findIndex((detail) => detail.name === e.target.name);
    const newWarning = CheckUserUpdateInputLine(String(e.target.name),
                                      e.target.value,
                                      e.target.name === "password2" ? 
                                        registerForm.password1 : 
                                        e.target.value
                                      );
    
    setWarnings((prevWarnings) => {
      const updatedWarnings = [...prevWarnings];
      updatedWarnings[index] = newWarning.join(", ");
      return updatedWarnings;
    });
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setRegisterForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  return  <form className="display-box">
            { (error) ? RegisterIssues(error) : null }
              <table>
                <tbody>
                  {formDetails.map(( formDetail, index ) => {
                    
                    if (formDetail.name === 'password2') {
                      return null
                    }
                    if (!passwordUpdate && (formDetail.name === 'password1' || formDetail.name === 'password2')) {
                      return null
                    }
                    if ( passwordUpdate && formDetail.name === 'password1') {
                      // If change password has been chosen
                      return <UpdatePassword 
                                              key = { index } 
                                              index={ index } 
                                              handleChange = { handleChange} 
                                              warnings = { warnings } 
                                              userToken = { userToken }/>
                    }
                    return (
                    <tr key={index}>
                      <td>
                        { formDetail.placeholder }
                      </td>
                      <td>
                      { formDetail.element === "input" &&  (
                          <input 
                            disabled= { (formDetail.name === "employee_id" || formDetail.name === "email") ? true : false }               
                            type= {formDetail.type}
                            name= {formDetail.name}
                            placeholder= {formDetail.placeholder}
                            value={ registerForm[formDetail.name] }
                            maxLength={formDetail.maxLength || undefined}
                            onChange= { handleChange }
                          />    
                      )}
                        {formDetail.element === "select" && (
                          <div style = {{ display: "flex ", alignItems: "top" }}>
                            <label 
                              htmlFor={ formDetail.name }
                              style = {{ marginRight: "10px" }}>
                              {formDetail.placeholder}
                            </label>
                              <select 
                                id= { formDetail.name }
                                name= { formDetail.name } 
                                value= {registerForm[formDetail.name]} 
                                onChange= { (e) => handleChange(e) }
                              > 
                                {formDetail.options?.map((option) => (
                                  <option key= { option } value={ option }>
                                    {option}
                                  </option>
                                ))}
                              </select> 
                          </div>   
                        )}     
                      </td>
                      <td>
                        {warnings[index] && WarningDisplay(warnings[index])}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="button-container">
                <button type= "submit"
                  onClick={(e) => {
                                  e.preventDefault();
                                  setPasswordUpdate(prevState => !prevState);
                                }}
                >
                  {passwordUpdate? "Close" : "Password"}
                </button>
                <button type= "submit"
                        disabled={formComplete}
                        onClick={(e) => {
                          e.preventDefault();
                          fetch(BACKEND_URL + "/users/update", {
                              method: "POST",
                              headers: { 
                                "Content-Type": "application/json",
                                "Authorization": "Bearer " + userToken
                              },
                              body: JSON.stringify(registerForm),
                              })
                              .then(response => response.json())
                              .then(data => { 
                                if (data.error) { setError(data.error) }
                                if (data) {
                                  localStorage.setItem("message", UpdateHomeMessage)
                                  setError(null);
                                  navigate('/');
                                }
                              })
                              .catch((error) => alert("Error logging in: " + error));
                            
                        }}
                >
                  { formComplete ? <span>Complete the form</span> :<span>UPDATE</span> }
                </button>
            </div>
          </form>;
    
}


