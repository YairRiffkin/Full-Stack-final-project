import { useEffect, useState } from "react";
import { User } from "../models/usertypes";
import './pagestyle.css'


export function HomePage() {
  const [userDetails, setUserDetails] = useState<User | null>(null)
    useEffect(() => {
      const userData = localStorage.getItem("userData");
      setUserDetails(userData ? JSON.parse(userData) : null)
  }, []);

        
        if (userDetails) {
          console.log("userDetails: ", userDetails);
          const username = userDetails.username;
          console.log("username: ", username)
          return <>
            <h2>You are logged in as:</h2>
            <p>{userDetails.username}</p>
            <p>{userDetails.employee_id}</p>
            <p>{userDetails.role} {userDetails.location}</p>
            <p>{userDetails.user_level}</p>
          </>
        } else {
        return <h2>Home Page - nothing for now</h2>;
        }
}
