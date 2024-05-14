import { useEffect, useState } from "react";
import '../components/static/pendingstyle.css'
import { DetailsDisplay } from "../components/pages/PendingHtmlElements";
import { MyResponseContainerType, initialMyResponse } from "../models/Responsetypes";
import { useLocalStorage } from "@uidotdev/usehooks";
import { User } from "../models/usertypes";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export type PendingDataProps = { 
                            userDetails: User | null;
                            userToken: string | null;
                            }

export function PendingRequest({ userDetails, userToken }: PendingDataProps) {

    const [pendingData, setPendingData] = useState<MyResponseContainerType>(initialMyResponse);
    const [indexed, setIndexed] = useLocalStorage<number>("Index", 1);

    useEffect(() => {
        fetch(BACKEND_URL + "/items/pending", {
            method: "POST",
            headers:    { 
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + userToken
                        },
                        body: localStorage.getItem("userData"),
            })
        .then(response => {
            console.log("fetch response: ", response)
            return response.json();})
        .then(data => {
            console.log("register data: ", data.data);
            setPendingData(data.data);
        })
        .catch((error) => alert("Error fetching pending data: " + error));
        
    }, [userToken]);

    const handleNext = () => {
        setIndexed((prevIndexed) => prevIndexed + 1);
    };
    
    const handleBack = () => {
        setIndexed((prevIndexed) => (prevIndexed > 1 ? prevIndexed - 1 : 1)); // Prevent decreasing below 1
        };

    
    console.log("index: ", indexed)
    return (
        <form className="pending">
            <div className="container">
                <div className="top-box">
                    <>by cost center</>
                </div>
                <div className="buttons">
                    <button onClick={handleBack}>Back</button>
                    <button onClick={handleNext}>Next</button>
                    <button>approve</button>
                </div>
                <div className="details-box">
                    < DetailsDisplay pendingData = {pendingData} indexed = {indexed} />
                </div>
                <div className="scroll-box">
                </div>
                <div className="bottom-text">
                    <textarea></textarea>
                </div>
            </div>
        </form>
    );
}