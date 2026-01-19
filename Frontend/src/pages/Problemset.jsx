import { useSelector,useDispatch } from "react-redux";
import { useState,useEffect } from "react";
import {UserMinusIcon} from "@heroicons/react/20/solid";
import { logoutUser } from "../authSlice";
import { useNavigate } from "react-router";

export default function Problemset() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const { isAuthenticated,loading,error } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleLogout = ()=>{
         dispatch(logoutUser());
    }

    useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, navigate]);

    return (
        
        <>
            <div className="h-15 w-screen bg-amber-600">
            
            <div className="flex justify-between mx-auto container p-3">
                
                <h1 className="text-2xl font-bold text-black ">LeetLab</h1>
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn">{user?.firstname}</div>
                        <ul tabIndex="-1" className="dropdown-content  bg-blend-saturation rounded-box z-1  p-2 shadow-sm">
                        <li className="flex justify-center items-center gap-3 p-2" onClick={handleLogout}>
                            Logout 
                            <UserMinusIcon className="h-5 w-5 cursor-auto"/>
                        </li>
                        </ul>
                    </div>
                
                </div>
            
            </div>
        </>
    )
}