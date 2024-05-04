
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/homepage';
import { LoginPage } from './pages/login';
import { NavigationBar } from './components/navigation-bar/navbar';
import { ItemList } from './pages/item';
import { NewItem } from './pages/new-item';
import { PendingRequest } from './pages/pending';
import { ProcData } from './pages/procurement';
import { UserEdit } from './pages/useredit';
import { NewUserRequest } from './pages/register';
import { Logout } from './pages/logout';
import { useEffect, useState } from 'react';
import { User } from './models/usertypes';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export default function App() {
  const initialUserToken = localStorage.getItem('userToken') || null;
  const [userToken, setUserToken] = useState<string | null>(initialUserToken || null);
  const [userDetails, setUserDetails] = useState<User | null>(null);

    useEffect(() => {
      
      if (userToken) {
      { fetch(BACKEND_URL + "/users/specific", { headers: { "Authorization": "Bearer " + userToken } })
        .then(response => response.json())
        .then(data => {
                      setUserDetails(data);
                      localStorage.setItem("userToken", userToken);
                      localStorage.setItem("userData", JSON.stringify(userDetails));
        })
        .catch((error) => alert("Error fetching user data: " + error))
      }}
      console.log("app user token: ", userToken);
      console.log("app user Details: ", userDetails);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userToken]);
    
    return <>
      <BrowserRouter >
      <NavigationBar setUserToken={setUserToken} setUserDetails={setUserDetails} userDetails={userDetails} />
        <div className='main'>
          <Routes>          
            <Route path="/" element={<HomePage userDetails={userDetails}/>} />
            <Route path="/login" element={<LoginPage setUserToken={setUserToken}/>} />
            <Route path="/item" element={<ItemList />} />
            <Route path="/newitem" element={<NewItem />} />
            <Route path="/pending" element={<PendingRequest />} />
            <Route path="/procurement" element={<ProcData />} />
            <Route path="/userdata" element={<UserEdit />} />
            <Route path="/register" element={<NewUserRequest setUserDetails={setUserDetails} userDetails={userDetails}/>} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  }
