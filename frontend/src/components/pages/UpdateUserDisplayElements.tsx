import { ChangeEventHandler, useState } from "react"
import { WarningDisplay } from "../functions/RegistrationValidateFunctions"


export const UpdateHomeMessage: string = 
    "Your details have been updated, and will activated on your next login"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export type UpdatePasswordProps = {
    handleChange: ChangeEventHandler<HTMLInputElement>,
    index: number,
    warnings: (string)[],
    userToken: string | null
    }



export function UpdatePassword( { handleChange, index, warnings, userToken }: UpdatePasswordProps ) {
    const [specificWarning, setSpecificWarning] = useState(null)
    const handleOldPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const oldPassword = e.target.value;
        fetch(BACKEND_URL + "/users/password", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": "Bearer " + userToken
            },
            body: JSON.stringify({ password: oldPassword }) ,
            })
            .then(response => response.json())
            .then(data => {
              if (data.error) { 
                setSpecificWarning(data.error) 
              } else {
                setSpecificWarning(null)
              }
            })
            .catch((error) => alert("Error checking password: " + error));
          
    }

    return (<>
                <tr>
                    <td>Old Password</td>
                    <td>
                        <input               
                                className="form-box"
                                type= "password"
                                name= "old_password"
                                placeholder="Old Password"
                                maxLength= {6}
                                onBlur= { handleOldPassword }
                        /> 
                    </td>
                    <td>
                        {specificWarning && WarningDisplay(specificWarning)}
                      </td>
                </tr>
                <tr>
                    <td>New Password</td>
                    <td>
                        <input  
                                key = {index }
                                type= "password"
                                name= "password1"
                                placeholder="New Password"
                                maxLength= {6}
                                onChange= { handleChange }
                        /> 
                    </td>
                    <td>
                        {warnings[index] && WarningDisplay(warnings[index])}
                    </td>
                </tr>
                <tr>
                    <td>Verify Password</td>
                    <td>
                        <input           
                            key = {index + 1 }
                            type= "password"
                            name= "password2"
                            placeholder="Verify Password"
                            maxLength= {6}
                            onChange= { handleChange }
                        /> 
                    </td>
                    <td>
                        {warnings[index] && WarningDisplay(warnings[index])}
                    </td>
                </tr>
            </>
    )
}



