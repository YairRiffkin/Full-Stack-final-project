
import { useEffect, useState } from "react";
import { homeView, navBarView, navLeftView } from "./user-elements";
import './navbar.css'
import { Link } from "react-router-dom";

export function NavigationBar() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const storedData = localStorage.getItem("userData");
    const userDetails = JSON.parse(storedData);
    const userLevel = userDetails?.user_level;
    (userLevel) ? localStorage.setItem("user_level", userLevel) : null;
    useEffect(() => {
        (userLevel) ? setIsLoggedIn(true) : setIsLoggedIn(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [localStorage.getItem("access_token")]);
    
    return <>
        <nav className="navbar">
        {isLoggedIn ? (
            <>
                <div>{ navLeftView(userDetails?.username) }</div>
                <div>{ navBarView(userDetails?.user_level) }</div>
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
                                localStorage.removeItem("access_token");
                                localStorage.removeItem("userData");
                                localStorage.removeItem("user_level");
                            }}
                        >
                        Logout
                        </button>
                    </Link>
                </div>
            </nav>
            </>
}
