import { useEffect, useState } from 'react'
import './App.css'
import Signupform from './pages/Signupform';
import Loginpage from './pages/Loginpage';
import Homepage from './pages/Homepage';
import { Navigate, Route,Routes } from 'react-router';
import { useDispatch,useSelector } from 'react-redux';
import { checkAuth } from './authSlice';
import Problemset from './pages/Problemset';
import Adminpage from './pages/adminPage';
import Problempage from './pages/Problempage';

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
        <Route path='/ProblemSet'element = {<Problemset/>}></Route>
        <Route path='/Admin'element = {<Adminpage/>}></Route>
        <Route path='/Problem/:id'element = {<Problempage/>}></Route>
      </Routes>
    </div>

  );
}

export default App;
