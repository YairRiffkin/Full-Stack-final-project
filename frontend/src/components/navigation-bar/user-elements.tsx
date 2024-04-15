import { Link } from 'react-router-dom'

export function adminView() {
    return <>
        <Link to="/item">Items List</Link>
        <Link to="/newitem">New Item</Link>
        <Link to="/pending">Pending Requests</Link>
        <Link to="/userdata">Edit Users</Link>
        <Link to="/procurement">Proc. Data</Link>
    </>
}

export function userView() {
    return <div>
        <Link to="/item">Items List</Link>
        <Link to="/newitem">New Item</Link>
        <Link to="/pending">Pending Requests</Link>
    </div>
}

export function procView() {
    return <div>
        <Link to="/procurement">Proc. Data</Link>
    </div>
}

export function guestView() {
    return <div>
        <Link to="/item">Items List</Link>
    </div>
}

export function homeView() {
    return <div>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
    </div>
}

export function navLeftView (name: string | "") {
    return <>
        <a>Welcome</a>
        <a>{ name }</a>
        <Link to= "/user-edit"><button>Edit Details</button></Link>
    </>
}

export function navBarView(user_level: string) {
    if (user_level === "admin") {
        return adminView();
    } else if (user_level === "user") {
        return userView();
    } else if (user_level === "proc") {
        return procView();
    } else if (user_level === "guest") {
        return guestView();
    }
}