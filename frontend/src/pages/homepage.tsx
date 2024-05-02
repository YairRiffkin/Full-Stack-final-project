import { useEffect, useState } from "react";
import { User } from "../models/usertypes";
import './pagestyle.css'


export function HomePage({ userDetails }: { userDetails: User | null }) {
  console.log("homepage: ", userDetails?.user_level)
        
        if (userDetails) {
          return <>
          <div className= "form-box">
          {userDetails.user_level === "pending" && <p>pending</p>}
          {userDetails.user_level === "admin" && <p>admin</p>}
          {userDetails.user_level === "user" && <p>user</p>}
          {userDetails.user_level === "proc" && <p>proc</p>}
          </div></>
        } else {
        return <h2 className="form-box">Home Page - nothing for now</h2>;
        }
}
