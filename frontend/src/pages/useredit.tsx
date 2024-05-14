import { useEffect, useState } from "react";
import '../components/static/pagestyle.css'
import { FormDetail } from "../models/formtypes";
import { RegisterIssues, WarningDisplay } from "../components/functions/RegistrationValidateFunctions";
import { NewUser, User } from "../models/usertypes";
import { useNavigate } from "react-router-dom";
import { RegistrationFormDetails } from "../components/pages/RegistrationDisplayElements";
import { CheckUpdateUserComplete, CheckUserUpdateInputLine } from "../components/functions/UpdateUserValidateFunctions";
import { UpdateHomeMessage } from "../components/pages/UpdateUserDisplayElements";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export type UserDataProps = { 
                            userDetails: User | null;
                            userToken: string | null;
                            }

export function UserEdit({ userDetails, userToken }: UserDataProps) {
  //TODO: add "update password" feature
  const formDetails: FormDetail[] = RegistrationFormDetails;
  const userData = localStorage.getItem("userData");
  const defaultForm = userData ? JSON.parse(userData) : null;
  const [registerForm, setRegisterForm] = useState<NewUser>({ username: defaultForm?.username || "",
                                                              employee_id: defaultForm?.employee_id || "",
                                                              email: defaultForm?.email || "",
                                                              location: defaultForm?.location || "",
                                                              phone_number: defaultForm?.phone_number || "",
                                                              role: defaultForm?.role || "",
                                                              password1: "",
                                                              password2: ""
                                                            })
  const [warnings, setWarnings] = useState<(string)[]>(Array(formDetails.length).fill(""));
  const [error, setError] = useState<string[] | null>(null)
  const [formComplete, setFormComplete] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    setFormComplete(CheckUpdateUserComplete(registerForm, warnings));
    // setUpdatePassword(updateClick ? true : false)
  }, [error, registerForm, userDetails, warnings]);  
  
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

  return  <form className="form-box">
            { (error) ? RegisterIssues(error) : null }
              <table>
                <tbody>
                  {formDetails.map(( formDetail, index ) => {
                    if (formDetail.name === 'password1' || formDetail.name === 'password2') {
                      return null;
                    }
          
                    return (
                    <tr key={index}>
                      <td>{ formDetail.placeholder }</td>
                      <td>
                      { formDetail.element === "input" &&  (
                          <input 
                            disabled= { (formDetail.name === "employee_id" || formDetail.name === "email") ? true : false }               
                            type= {formDetail.type}
                            name= {formDetail.name}
                            value={ registerForm[formDetail.name] }
                            maxLength={formDetail.maxLength || undefined}
                            onChange= { handleChange }
                          />    
                      )}
                        {formDetail.element === "select" && (
                          <div style = {{ display: "flex ", alignItems: "top" }}>
                            <label style = {{ marginRight: "10px" }}>
                              {formDetail.placeholder}: 
                            </label>
                              <select 
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
                                console.log("update response: ", data);
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
                  { formComplete ? <span>Complete the form</span> :<strong>UPDATE</strong> }
                </button>
            
          </form>;
    
}


