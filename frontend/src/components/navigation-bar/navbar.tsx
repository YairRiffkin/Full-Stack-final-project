// Navigation bar element:
// available options update according to user level

import { homeView, navBarView, navLeftView } from "./navbaruserinterface";
import '../static/navbar.css';
import { Link } from "react-router-dom";
import { User } from "../../models/usertypes";
import { useEffect } from "react";


export type UserDataProps = {   setUserToken: (userId: string | null) => void;
                                userDetails: User | null;
                                setUserDetails: (details: User | null) => void;
                            }

export function NavigationBar({ setUserToken, userDetails, setUserDetails }: UserDataProps) { 
    useEffect(() => {
        if (userDetails) {localStorage.setItem("userData", JSON.stringify(userDetails));}
    }, [userDetails]);
    

    
    return <>
        <nav className="navbar">
        {userDetails ? (
            <>
                <div>{ navLeftView(userDetails.username || "") }</div>
                <div>{ navBarView(userDetails.user_level || "") }</div>
            </>
        ) : (
            <>
                <div>{ navLeftView("Guest") }</div>
                <div>{ homeView() }</div>
            </>
            )}
                <div>
                    <Link to="/">
                        <button
                            onClick={() => {
                                setUserToken(null)
                                setUserDetails(null)
                                localStorage.clear();
                            }}
                        >
                        Logout
                        </button>
                    </Link>
                </div>
            </nav>
            </>
}
