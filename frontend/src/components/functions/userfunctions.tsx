import { useState } from "react";
import { User } from "../../models/usertypes";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export function CreateUserDetails () {
    const storedData = localStorage.getItem("userData");
    const userDetails = storedData !== null ? JSON.parse(storedData) : null;
return userDetails;
}

export function FetchUserDetails() {
    //TODO: catch error on this function
    const [userData, setUserData] = useState<User | null>(null);
    fetch(BACKEND_URL + "/users/specific", { headers: { "Authorization": "Bearer " + localStorage.getItem("access_token") } })
    .then(response => response.json())
    .then(data => setUserData(data));
    return userData
}