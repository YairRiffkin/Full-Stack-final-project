import { useEffect, useState } from "react";
import './pagestyle.css'
import { FormDetail } from "../models/formtypes";
import { RegistrationFormDetails } from "../components/pages/RegistrationDisplayElements";
import { CheckFormComplete, CheckInputLine, RegisterIssues, SetDefaultWarning } from "../components/functions/RegistrationValidateFunctions";
import { NewUser, User } from "../models/usertypes";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export function NewUserRequest() {
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
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    setFormComplete(CheckFormComplete(registerForm, warnings));
    if (userData) { localStorage.setItem("userData", JSON.stringify(userData)); }
  }, [error, registerForm, userData, warnings]);

  console.log("error: ", error);
  console.log("userData: ", userData);
  
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const index = formDetails.findIndex((detail) => detail.name === e.target.name);
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

  return  <form className="form-box">
            { (error) ? RegisterIssues(error) : null }
            {formDetails.map(( formDetail, index ) => (
            <div key= {index}>
              { warnings[index] && <small style={{color: "red"}}>{warnings[index]}</small>}
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
                  <label style = {{ marginRight: "10px" }}>{formDetail.placeholder}: </label>
                  <select name= {formDetail.name} onChange= { (e) => handleChange(e) }> 
                    {formDetail.options?.map((option) => (
                      <option key= {option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select> 
                </div>   
              )}     
              </div>
              ))}
              <button
                type= "button"
                disabled={formComplete}
                onClick={() => {
                  // if (error) { e.preventDefault(); }
                  console.log("error: ", error);
                  fetch(BACKEND_URL + "/new_user", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(registerForm),
                      })
                      .then(response => response.json())
                      .then(data => { 
                        if (data.error) { setError(data.error) }
                        if (data.userData) { 
                          setUserData(data.userData);
                          setError(null);
                        }
                      })
                      .catch((error) => alert("Error logging in: " + error));
                    
                  }}
              >
                 { formComplete ? <span>Complete the form as requested</span> :<strong>SUBMIT</strong> }
              </button>
          </form>;
    
}


