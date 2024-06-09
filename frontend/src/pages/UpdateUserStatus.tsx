import { useEffect, useRef, useState } from 'react';
import '../components/static/GeneralPage.css'
import { User } from '../models/usertypes';
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export function UpdateUserLevel({ userToken }: { userToken: string | null }) {
    const inputdataRef = useRef<HTMLInputElement>(null);
    const [employeeID, setEmployeeID] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [inputComplete, setInputComplete] = useState<boolean> (false);
    const [userLevel, setUserLEvel] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        console.log("input before: ", inputComplete);
        if (inputComplete) {
            console.log("input complete", employeeID);
            fetch(BACKEND_URL + "/users/getdata", {
                            method: "POST",
                            headers: { 
                              "Content-Type": "application/json",
                              "Authorization": "Bearer " + userToken
                            },
                            body: JSON.stringify({ employeeID: employeeID }),
                          })
                            .then(response => response.json())
                            .then(data => {
                                console.log("data: ", data);
                                if (data.error) {
                                    console.log("error: ", error);
                                    setError(JSON.stringify(data.error));
                                } else {
                                    setUser(data.data);
                                    setUserLEvel(data.data.user_level)
                                    console.log("data: ", data.data);
                                }
                                })
                            .catch((error) => alert("Error fetching data: " + error));
            
        }
        setInputComplete(false);
        console.log("input after: ", inputComplete);
      }, [employeeID, error, inputComplete, userToken]);

    function CheckInputLine(e: React.ChangeEvent<HTMLInputElement>) {
        console.log("Checking input", e.target.value)
        if (e.target.value.length === 6 && /^[et]/i.test(e.target.value)) {
            setError(null)
            setInputComplete(true);
        } else {
            setError("Data: Incorrect input")
        }
    }

    const handleApprove = () => {
        fetch(BACKEND_URL + "/users/changelevel", {
            method: "POST",
            headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + userToken
            },
            body: JSON.stringify({
                                ID: employeeID,
                                User_level: user?.user_level
                                }),
        })
        .then(response => response.json())
        .then(data => {
            console.log("data: ", data);
            if (data.error) {
                console.log("error: ", error);
                setError(JSON.stringify(data.error));
            } else {
                console.log("data: ", data.data);
                navigate('/', { state: user} );
                
            }
            })
        .catch((error) => alert("Error fetching data: " + error));
            
        }

    return (
            <div className='display-box'>
                <div className='button-container'>
                <label htmlFor="inputdata">Type employee ID: </label>
                    <input 
                        type="text"
                        name='inputdata'
                        placeholder='Type employee ID here'
                        ref={inputdataRef}
                        value = { employeeID }
                        onChange= { (e: React.ChangeEvent<HTMLInputElement>) => {
                            setEmployeeID(e.target.value);
                            console.log("employeeId: ", employeeID)
                            CheckInputLine(e);
                        }}
                    />
                    <button 
                        type='submit' 
                        onClick={() => {
                            handleApprove();
                            }}
                    >
                        Approve
                    </button>
                </div>
                        { error && <small style={{color: "red"}}>{ error }</small>}
                        { !error && user && <>
                            <h2>Current Details</h2>
                            <p>{user.username}</p>
                            <p>{user?.employee_id}</p>
                            <p>
                                <strong>{userLevel}</strong>
                            </p>
                            <br/>
                            <h2><label htmlFor="selectLevel">User Level when approved:</label></h2>
                            <select 
                                name="selectLevel"
                                value = { user.user_level!}
                                onChange={(e) => {
                                    setUser({ ...user, user_level: e.target.value });
                                  }}
                                >
                                    <option value = "guest">Guest</option>
                                    <option value = "user">User</option>
                                    <option value = "proc">Proc</option>
                                    <option value = "admin">Admin</option>                  
                            </select>
                        </>

                        }
            </div>
            )
}