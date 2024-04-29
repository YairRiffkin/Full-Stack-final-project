
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

export default function App() {
    
    return <>
      <BrowserRouter >
        <NavigationBar />
        <Routes>          
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/item" element={<ItemList />} />
          <Route path="/newitem" element={<NewItem />} />
          <Route path="/pending" element={<PendingRequest />} />
          <Route path="/procurement" element={<ProcData />} />
          <Route path="/userdata" element={<UserEdit />} />
          <Route path="/register" element={<NewUserRequest />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </BrowserRouter>
    </>
  }
