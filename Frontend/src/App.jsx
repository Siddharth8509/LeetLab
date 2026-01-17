import { useEffect, useState } from 'react'
import './App.css'
import Signupform from './pages/Signupform';
import Loginpage from './pages/Loginpage';
import Homepage from './pages/Homepage';
import { Navigate, Route,Routes } from 'react-router';
import { useDispatch,useSelector } from 'react-redux';
import { checkAuth } from './authSlice';

function App() {
  const {isAuthenticated} = useSelector((state)=>state.auth);
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(checkAuth());
  },[dispatch])

  return (
    <div className='app'>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Homepage /> : <Navigate to="/Signup"/>}/>
        <Route path="/Login" element={isAuthenticated ? <Navigate to="/"/> : <Loginpage />} />
        <Route path="/Signup" element={isAuthenticated ? <Navigate to="/"/> : <Signupform />} />
      </Routes>
    </div>

  );
}

export default App;
