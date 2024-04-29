
import { useEffect, useRef, useState } from "react";
import { homeView, navBarView, navLeftView } from "./navbaruserinterface";
import './navbar.css'
import { Link, useLocation } from "react-router-dom";
import { User } from "../../models/usertypes";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export function NavigationBar() {
    const [userDetails, setUserDetails] = useState<User | null>(null)
    const location = useLocation();
    const precLocationRef = useRef(location);
    useEffect(() => {
        if (precLocationRef.current.pathname !== location.pathname) {
            if (localStorage.getItem("access_token")){
                fetch(BACKEND_URL + "/users/specific", { 
                    headers: { "Authorization": "Bearer " + localStorage.getItem("access_token") } }
                )
                .then(response => response.json())
                .then(data => setUserDetails(data));
            }
        }
        precLocationRef.current = location;
                    }
    , [location, userDetails]);
    
    return <>
        <nav className="navbar">
        {userDetails ? (
            <>
                <div>{ navLeftView(userDetails.username) }</div>
                <div>{ navBarView(userDetails.user_level) }</div>
            </>
        ) : (
            <>
                <div>{ navLeftView("Guest") }</div>
                <div>{ homeView() }</div>
            </>
            )}
                <div>
                    <Link to="/logout">
                        <button
                            onClick={() => {
                                localStorage.removeItem("access_token");
                                localStorage.removeItem("userData");
                                localStorage.removeItem("data");
                                setUserDetails(null);
                            }}
                        >
                        Logout
                        </button>
                    </Link>
                </div>
            </nav>
            </>
}
