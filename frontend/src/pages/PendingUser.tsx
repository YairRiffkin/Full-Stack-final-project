// Handles pending users. Get list and approve if OK

import { useEffect, useState } from "react";
import '../components/static/pendingstyle.css'
import { MyResponseContainerType } from "../models/Responsetypes";
import { User, UserContainerType } from "../models/usertypes";
import { Item } from "../models/itemtypes";
import { UserDisplayTable, UsersDisplay } from "../components/pages/PendingUserHtmlElements";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;


export function PendingUserRequest({ userToken }: { userToken: string | null }) {
    const [pendingData, setPendingData] = useState<MyResponseContainerType | null>({});
    const [indexed, setIndexed] = useState<number>(1);
    const [userDetails, setUserDetails] = useState<UserContainerType | null>({});
    const [display, setDisplay] = useState<Item | User | null>(null)
    const [approvalStatus, setApprovalStatus] = useState(false);
    const [userLevel, setUserLevel] = useState<string>("Guest");
    let scrollItem = 1;

    useEffect(() => {
      fetch(BACKEND_URL + "/users/pending", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer " + userToken
        },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
        })
      .then(data => {        
        // Get all pending users according to selection      
        if (data && data.data) {
          setPendingData(data.data);
          setUserDetails(data.user)
          if (data.user && data.user[indexed]) {
            setDisplay(data.user[indexed]);
          } else {
            setDisplay(null);
          }
        } 
      })
        .catch((error) => {
          alert("Error fetching pending data: " + error.message);
        });
        if (approvalStatus) {
          setApprovalStatus(false);
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [userToken, approvalStatus]);

    const handleScroll = () => {
      /*Scrolls through the list*/
      setIndexed((prevIndexed) => {
        const pendingDataLength = pendingData ? Object.keys(pendingData).length : 0;
        if (userDetails && (prevIndexed < pendingDataLength || prevIndexed > 0)) {
          const nextItem = userDetails[prevIndexed + scrollItem];
          if (nextItem) {
            setDisplay(nextItem);
            return prevIndexed + scrollItem;
          } else {
            setDisplay(userDetails[prevIndexed]);
            console.warn('Next item is undefined or null');
            return prevIndexed;
          }
        } else {
          return prevIndexed;
        }
      });
    };

    const handleApprove = () => {
      /* If approved - taken off the list */
      const pendingDataLength = pendingData ? Object.keys(pendingData).length : 0;
      if (pendingDataLength > 0) {
      fetch(BACKEND_URL + "/users/approve", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer " + userToken
        },
        body: JSON.stringify({
                              ID: pendingData && pendingData[indexed] ? pendingData[indexed]?.relative ?? "" : "",
                              User_level: userLevel
                            }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
        })
      .then(data => {
        if (data && data.data) {
          setApprovalStatus(true);
          const pendingDataLength = pendingData ? Object.keys(pendingData).length : 0;
          setIndexed(indexed >= pendingDataLength ? pendingDataLength - 1 : indexed);
    }})
          .catch(error => {
            console.error("Error:", error);
          });
        }
        };
      

      
    return (
      <div className="pending">
          <div className="buttons">
            <button 
              onClick={() => {
                              scrollItem = -1;
                              handleScroll();
                              }}
            >
              Back
            </button>
            <button 
              onClick={() => {
                              scrollItem = 1;
                              handleScroll();
                              }}
            >
              Next
            </button>
            <button
              onClick={() => {
                              handleApprove();
                              }}
            >
              Approve
            </button>
          </div>
          <div className="details-box">
              <UsersDisplay pendingData={pendingData} indexed={indexed} />
          </div>
          <div className="scroll-box">
              <UserDisplayTable display={display} />
          </div>
          { display && (
          <div className="bottom-text">
          <label htmlFor="selectLevel">User Level when approved:</label>
            <select 
              name="selectLevel"
              onChange={(e) => { setUserLevel(e.target.value); }}
            >
              <option>Guest</option>
              <option>User</option>
              <option>Proc</option>
              <option>Admin</option>                  
            </select>
          </div> )}
      </div>
  );
}