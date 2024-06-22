
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/Login';
import { NavigationBar } from './components/navigation-bar/navbar';
import { ItemList } from './pages/ItemList';
import { NewItemLog } from './pages/NewItem';
import { PendingItemRequest } from './pages/PendingItem';
import { ProcData } from './pages/Procurement';
import { UserEdit } from './pages/UserEdit';
import { NewUserRequest } from './pages/Register';
import { useEffect } from 'react';
import { User } from './models/usertypes';
import { useLocalStorage } from "@uidotdev/usehooks";
import { PendingUserRequest } from './pages/PendingUser';
import { UpdateUserLevel } from './pages/UpdateUserStatus'
import { FinalList } from './pages/FinalList'

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
            <Route path="/ItemList" element={<ItemList userToken={ userToken}/>} />
            <Route path="/UserEdit" element={<UserEdit userDetails={userDetails} userToken={ userToken}/>} />
            <Route path="/newitem" element={<NewItemLog userToken={ userToken} userDetails={userDetails}/>} />
            <Route path="/PendingItem" element={<PendingItemRequest userToken={ userToken} />} />
            <Route path="/Procurement" element={<ProcData userToken={ userToken} />} />
            <Route path="/PendingUser" element={<PendingUserRequest userToken={ userToken} />} />
            <Route path="/UserLevel" element={<UpdateUserLevel userToken={ userToken} />} />
            <Route path="/FinalList" element={<FinalList userToken={ userToken} />} />
            <Route path="/register" element={<NewUserRequest setUserDetails={setUserDetails} />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  }
