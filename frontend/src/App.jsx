import Navbar from './component/navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SettingPage from './pages/SettingPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import {Routes,Route} from "react-router-dom";
import {useAuthStore} from "./store/useAuthStore.js";
import {useTheme} from "./store/useTheme.js";
import { useEffect } from 'react';
import {Loader} from "lucide-react";
import { Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers}=useAuthStore();

  const {theme}=useTheme();

  console.log({onlineUsers});

  useEffect(()=>{
    checkAuth();
  }, [checkAuth]);

  console.log({authUser});
  
  if(isCheckingAuth && !authUser) return(
    <div className="flex item-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  )


  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
      <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
      <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
      <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/settings" element={<SettingPage />} />
      <Route path="profile" element={<ProfilePage />} />
      </Routes>
      <Toaster />
</div>
  );
};

export default App






