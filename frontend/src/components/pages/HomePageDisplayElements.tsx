import { User } from "../../models/usertypes"

export function BlankHeader() {
    return  <>
                <h2>Welcome to SPARE PARTS MANAGEMENT TOOL. </h2><br />
                <>IF you are already a registered user, just LOGIN. </><br />
                <>If you are new to the APP, you can REGISTER. </><br />
                <>Please pay attention to the following: </>
                <ol>
                    <li>You must be a XXX employee</li>
                    <li>In order to register you need a valid XXX email and employee ID.</li>
                    <li>Once you have registered your request will be pending until your system administrator will approve you as a registered user.</li>
                    <li>You will be able to see your status when you LOGIN with the details you provided</li>
                </ol><br />
                <>For any questions, you can contact your administrator: <strong>Yair Riffkin</strong></>
            </>
}

export function PendingHeader() {
    return  <>
                <h2>Your request is PENDING</h2><br />
                <p>For any questions, you can contact your administrator: <strong>Yair Riffkin</strong></p><br />
                <p> Your recorded details are: </p><br />
            </>
}

export function ActiveHeader() {
    return  <>
                <h2>{localStorage.getItem("message") ? localStorage.getItem("message") : "Welcome"}</h2><br />
                <>You are logged in as:</><br />
            </>
}

export function UpdateHeader() {
    return  <>
                <h2>User level has been changed</h2><br />
            </>
}

export function HomeBodyDisplay({ userDetails }: { userDetails: User | null }) {
    return  <>
                <p>{userDetails?.username}</p>
                <p>{userDetails?.employee_id}</p>
                <p>{userDetails?.role} {userDetails?.location}</p>
                <p><strong>{userDetails?.user_level}</strong></p>
            </>
}

