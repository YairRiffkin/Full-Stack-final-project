
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/homepage';
import { LoginPage } from './pages/login';
import { NavigationBar } from './components/navigation-bar/navbar';
import { ItemList } from './pages/item';
import { NewItemLog } from './pages/new-item';
import { PendingRequest } from './pages/pending';
import { ProcData } from './pages/procurement';
import { UserEdit } from './pages/useredit';
import { NewUserRequest } from './pages/register';
import { Logout } from './pages/logout';
import { useEffect } from 'react';
import { User } from './models/usertypes';
import { useLocalStorage } from "@uidotdev/usehooks";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export default function App() {
  const [userToken, setUserToken] = useLocalStorage<string | null>("userToken", null);
  const [userDetails, setUserDetails] = useLocalStorage<User | null>("userData", null);

  useEffect(() => {
    if (userToken && !userDetails) {
      fetch(`${BACKEND_URL}/users/specific`, {
        headers: { "Authorization": `Bearer ${userToken}` }
      })
      .then(response => response.json())
      .then(data => setUserDetails(data))
      .catch(error => alert("Error fetching user data: " + error));
    }
  }, [setUserDetails, userDetails, userToken]);
   
    return <>
      <BrowserRouter >
      <NavigationBar setUserToken={setUserToken} setUserDetails={setUserDetails} userDetails={userDetails} />
        <div className='main'>
          <Routes>          
            <Route path="/" element={<HomePage userDetails={userDetails}/>} />
            <Route path="/login" element={<LoginPage setUserToken={setUserToken}/>} />
            <Route path="/item" element={<ItemList />} />
            <Route path="/newitem" element={<NewItemLog userToken={ userToken} userDetails={userDetails}/>} />
            <Route path="/pending" element={<PendingRequest userToken={ userToken} userDetails={userDetails}/>} />
            <Route path="/procurement" element={<ProcData />} />
            <Route path="/userdata" element={<UserEdit userToken={ userToken} userDetails={userDetails}/>} />
            <Route path="/register" element={<NewUserRequest setUserDetails={setUserDetails} userDetails={userDetails}/>} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  }
