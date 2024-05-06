
import { Path, useForm, UseFormRegister, SubmitHandler } from 'react-hook-form';
import { NewUser, User } from '../models/usertypes';
import { FormDetail } from '../models/formtypes';
import { RegistrationFormDetails } from '../components/pages/RegistrationDisplayElements';
import { CheckInputLine } from '../components/functions/RegistrationValidateFunctions';

export type UserDataProps = { 
    userDetails: User | null;
    setUserDetails: (details: User | null) => void;
    }


export function UserEdit ({ setUserDetails, userDetails }: UserDataProps) {
    const formDetails: FormDetail[] = RegistrationFormDetails;
    console.log("parsed: ", userDetails);
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm({mode: 'onTouched'});

    const isLabel = true;
    
    
    
    const onSubmit = (data) => {
      // Handle form submission (e.g., send data to the server)
      console.log(data);
    };
  
    return (
      <div className='form-box'>
        <form >
          <table>
            {formDetails.map(( formDetail, index ) => (
              <tr key={index}>
                {isLabel ? <td>{ formDetail.placeholder }</td> : null}
                  
                  <td>
                    {formDetail.element === "input" && (
                    <input
                      type={formDetail.type}
                      placeholder={formDetail.placeholder}
                      maxLength={formDetail.maxLength || undefined}
                      {...register(formDetail.name, {
                        required: true,
                        validate: (value) => {
                          const warnings = CheckInputLine(formDetail.name, value, "");
                          console.log("name: ", formDetail.name, "value: ", value);
                          console.log("warnings: ", warnings);
                        return warnings.length === 0 || warnings.join(', ');
                          }
                      })}
                    /> 
                    )}
                    {formDetail.element === "select" && (              
                    <div style = {{ display: "flex ", alignItems: "top" }}>
                      <label style = {{ marginRight: "10px" }}>{formDetail.placeholder}: </label>
                        <select 
                          {...register(formDetail.name, {
                          required: true,
                          validate: (value) => {
                            const warnings = CheckInputLine(formDetail.name, value, "");
                            console.log("name: ", formDetail.name, "value: ", value);
                            console.log("warnings: ", warnings);
                          return warnings.length === 0 || warnings.join(', ');
                          }
                          })} 
                        >
                          {formDetail.options?.map((option) => (
                            <option key= {option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select> 
                    </div> 
                        )}
                  </td>
                  <td>
                      {errors[formDetail.name] && (
                        <small style={{ color: "red" }}>{errors[formDetail.name].message}</small>
                      )}
                  </td>
                  
              </tr>
            ))}
          </table>
            <button type="submit" onClick={handleSubmit(onSubmit)}>Register</button>
        </form>
      </div>
    );
}