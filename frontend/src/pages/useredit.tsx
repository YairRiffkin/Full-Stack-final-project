
import { Path, useForm, UseFormRegister, SubmitHandler } from 'react-hook-form';
import { NewUser } from '../models/usertypes';
import { FormDetail } from '../models/formtypes';
import { RegistrationFormDetails } from '../components/pages/RegistrationDisplayElements';
import { CheckInputLine } from '../components/functions/RegistrationValidateFunctions';



const isLabel: boolean = true;

export function UserEdit () {
    const formDetails: FormDetail[] = RegistrationFormDetails;
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();
    
    
    
      const onSubmit = (data) => {
        // Handle form submission (e.g., send data to the server)
        console.log(data);
      };
  
      return (
        <div className='form-box'>
          <form >
          {formDetails.map(( formDetail, index ) => (
          <div key={index}>
          {formDetail.element === "input" && (
            <>
              {errors[formDetail.name] && (
                <small style={{ color: "red" }}>{errors[formDetail.name].message}</small>
              )}
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
            </>
          )}
           {formDetail.element === "select" && (
            <>
            {errors[formDetail.name] && (
                <small style={{ color: "red" }}>{errors[formDetail.name].message}</small>
              )}
                <div style = {{ display: "flex ", alignItems: "top" }}>
                  <label style = {{ marginRight: "10px" }}>{formDetail.placeholder}: </label>
                  <select {...register(formDetail.name)}>
                    {formDetail.options?.map((option) => (
                      <option key= {option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select> 
                </div> 
                </>  
              )} 
        </div>
            ))}
            <button type="submit" onClick={handleSubmit(onSubmit)}>Register</button>
          </form>
        </div>
      );
    }