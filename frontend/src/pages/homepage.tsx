import { useEffect, useState } from "react";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export function HomePage() {
    const [userData, setUserData] = useState<any | null>(localStorage.getItem("userData"));

      useEffect(() => {
          if (localStorage.getItem("access_token")) {
            fetch(BACKEND_URL + "/users/specific", { headers: { "Authorization": "Bearer " + localStorage.getItem("access_token") } })
            .then(response => response.json())
            .then(data => setUserData(data));
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
