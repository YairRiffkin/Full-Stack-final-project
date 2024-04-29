import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export function LoginLines() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [inputStatus, setInputStatus] = useState<boolean>(true);
    const [userData, setUserData] = useState<string | null>(null)

    function checkEmptyInput() {
        (usernameRef.current?.value && passwordRef.current?.value)? setInputStatus(false): setInputStatus(true);
    }
    


    return <div>
            <h2>Please login with your email or employee id as username</h2>
            <input 
                type="text" 
                name="username" 
                placeholder="Username" 
                ref={usernameRef}
                onChange={checkEmptyInput}
            />
            <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                ref={passwordRef} 
                onChange={checkEmptyInput} 
            />
            <Link to = "/home">
                <button 
                // TODO: error on both fetch's
                    disabled = {inputStatus}
                    if (inputStatus) {
                        
                    }
                    onClick={() => {
                        const username = usernameRef.current?.value || "";
                        const password = passwordRef.current?.value || "";
                        fetch(BACKEND_URL + "/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ username, password }),
                            })
                            .then(response => response.json())
                            .then(data => {
                                    localStorage.setItem("access_token", data.access_token);
                                    setUserData(data.access_token);
                                    console.log("done")})
                            .then(data => console.log(data))
                            .catch((error) => alert("Error logging in: " + error));
                        }
                    
                    }                
                    >&#10003;
                </button>
            </Link>
    </div>;
}

  