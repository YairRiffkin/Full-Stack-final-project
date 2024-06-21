import { Link } from 'react-router-dom'

export function adminView() {
    return <>
        <Link to="/ItemList">Items List</Link>
        <Link to="/newitem">New Item</Link>
        <Link to="/PendingItem">Pending Items</Link>
        <Link to="/PendingUser">Pending Users</Link>
        <Link to="/UserLevel">UpdateLevel</Link>
        <Link to="/FinalList">Final List</Link>
    </>
}

export function userView() {
    return <div>
        <Link to="/ItemList">Items List</Link>
        <Link to="/newitem">New Item</Link>
    </div>
}

export function procView() {
    return <div>
        <Link to="/Procurement">Proc. Data</Link>
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
        <Link to= "/useredit"><button>Edit Details</button></Link>
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