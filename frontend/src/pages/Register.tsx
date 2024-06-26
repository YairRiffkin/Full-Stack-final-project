// Handles registration of new user. if all is correct is stored as pending for admin approval

import { useEffect, useState } from "react";
import '../components/static/GeneralPage.css'
import { FormDetail } from "../models/formtypes";
import { RegistrationFormDetails } from "../components/pages/RegistrationDisplayElements";
import { CheckFormComplete, CheckInputLine, RegisterIssues, SetDefaultWarning, WarningDisplay } from "../components/functions/RegistrationValidateFunctions";
import { NewUser, User } from "../models/usertypes";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export type UserDataProps = { 
                            setUserDetails: (details: User | null) => void;
                            }

export function NewUserRequest({ setUserDetails }: UserDataProps) {
  const formDetails: FormDetail[] = RegistrationFormDetails;
  const [registerForm, setRegisterForm] = useState<NewUser>({ username: "",
                                                              employee_id: "",
                                                              email: "",
                                                              location: "--Choose--",
                                                              phone_number: "",
                                                              role: "--Choose--",
                                                              password1: "",
                                                              password2: ""
                                                            })
  const [warnings, setWarnings] = useState<(string)[]>(SetDefaultWarning(Array(formDetails.length).fill("")));
  const [error, setError] = useState<string[] | null>(null)
  const [formComplete, setFormComplete] = useState<boolean>(true);
  const navigate = useNavigate();

  

  useEffect(() => {
    setFormComplete(CheckFormComplete(registerForm, warnings));
  }, [error, registerForm, warnings]);
  
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const index = formDetails.findIndex((detail) => detail.name === e.target.name);
    // checks each new input for validation
    const newWarning = CheckInputLine(String(e.target.name),
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
      const { name, value } = e.target as HTMLButtonElement;
      setRegisterForm((prevData) => ({
        ...prevData,
        [name]: value,
      }));
  };
  return  <form className="display-box">
            { (error) ? RegisterIssues(error) : null }
              <table>
                <tbody>
                {formDetails.map(( formDetail, index ) => (
                  <tr key={index}>
                      <td>
                        {formDetail.element === "input" && (
                          <input                 
                            type= {formDetail.type}
                            name= {formDetail.name}
                            placeholder= {formDetail.placeholder}
                            maxLength={formDetail.maxLength || undefined}
                            onChange= { handleChange }
                          />    
                        )} 
                        {formDetail.element === "select" && (
                          <div style = {{ display: "flex ", alignItems: "top" }}>
                            <label 
                              htmlFor={ formDetail.name }
                              style = {{ marginRight: "10px" }}>
                              {formDetail.placeholder}: 
                            </label>
                              <select
                                id= { formDetail.name } 
                                name= { formDetail.name } 
                                onChange= { (e) => handleChange(e) }> 
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
                ))}
                </tbody>
              </table>
              <button type= "submit"
                      disabled={formComplete}
                      onClick={(e) => {
                        e.preventDefault(); 
                        fetch(BACKEND_URL + "/users/new_user", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(registerForm),
                            })
                            .then(response => response.json())
                            .then(data => { 
                              if (data.error) { setError(data.error) }
                              if (data.userData) { 
                                setUserDetails(data.userData);
                                setError(null);
                                navigate('/');
                              }
                            })
                            .catch((error) => alert("Error logging in: " + error));
                          
                      }}
              >
                { formComplete ? <span>Complete the form as requested</span> :<strong>SUBMIT</strong> }
              </button>
          </form>;
    
}


