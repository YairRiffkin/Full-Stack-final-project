import { useEffect, useState } from "react";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export function HomePage() {
    const [userData, setUserData] = useState<any | null>(localStorage.getItem("userData"));

      useEffect(() => {
          if (localStorage.getItem("access_token")) {
            const userDetails = JSON.parse(localStorage.getItem("userData"));
            setUserData(userDetails);
          }
        }, []);
       
        if (userData) {
          return <>
            <h2>You are logged in as:</h2>
            <p>{userData.username}</p>
            <p>{userData.employee_id}</p>
            <p>{userData.role} {userData.location}</p>
            <p>{userData.user_level}</p>
          </>
        } else {
        return <h2>Home Page - nothing for now</h2>;
        }
}
