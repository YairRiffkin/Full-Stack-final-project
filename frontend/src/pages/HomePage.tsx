// Default displays

import { ActiveHeader, BlankHeader, HomeBodyDisplay, PendingHeader, UpdateHeader } from "../components/pages/HomePageDisplayElements";
import { User } from "../models/usertypes";
import '../components/static/GeneralPage.css'
import { useLocation } from "react-router-dom";


export function HomePage({ userDetails }: { userDetails: User | null }) {
  const user = useLocation().state;
  let displayDetails: User | null
  let status: string;
  if (user) {
    status = "updated"
    displayDetails = user
  } else {
    // Checks what is the user level status to adjust display
    status = userDetails?.user_level ? 
                userDetails?.user_level === "pending" ?
                  "pending"
                : "active"
              : "blank";
    displayDetails = userDetails
  }

return  <div className="display-box">
          {status === "pending" && <PendingHeader />}
          {status === "active" && <ActiveHeader />}
          {status === "blank" && <BlankHeader />}
          {status === "updated" && <UpdateHeader />}
          <HomeBodyDisplay userDetails={displayDetails} />
        </div>        
}
