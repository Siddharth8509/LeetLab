import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon,EyeSlashIcon } from "@heroicons/react/24/solid";
import { useState,useEffect } from "react";
import { loginUser } from "../authSlice";
import { useSelector,useDispatch } from "react-redux";
import {useNavigate} from "react-router-dom"


// Schema
const LoginSchema = z
  .object({
    emailId: z.string().email("Invalid email address"),
    password: z.string().min(8, "Please enter a valid password"),
  })

export default function Loginpage() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated,loading,error } = useSelector((state) => state.auth);
    
  useEffect(()=>{
    if(isAuthenticated)
    {
      navigate("/");
    }
  },[isAuthenticated,navigate])

  const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: zodResolver(LoginSchema), });
   const onSubmit = (data) => {
      const { confirmedPassword, ...payload } = data;
      dispatch(loginUser(payload));
    };

   const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center mx-auto bg-linear-to-bl from-[#ffe4e6]  to-[#ccfbf1]">
    
    <div className="border-red-300 border-2  flex flex-col p-11 bg-linear-to-bl from-[#0f172a] via-[#1e1a78] to-[#0f172a] rounded-2xl">
    
    <h1 className="text-4xl font-bold text-center">Log In to LeetLab</h1>
    <p className="text-center font-light mt-1">Sign in to continue your coding journey.</p>

    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-5 gap-4">
              
      <div>
      <p className="text-[15px] mb-1">Email</p>
      <input {...register("emailId")}
        placeholder="Email" className="rounded-[10px] border p-2 w-105" />
        <p className="text-red-400 font-light">{errors.emailId?.message}</p>
      </div>

     <div>
      <p className="text-[15px] mb-1">Password</p>
        <div className="relative">
          <input type={showPassword ? "text" : "password"} {...register("password")} placeholder="Password"
          className="rounded-[10px] border p-2 w-105 pr-10" />
          <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
         </div>
      <p className="text-red-400 text-sm">{errors.password?.message}</p>
      </div>

      <button type="submit" className="btn mt-5 btn-dash btn-accent">Submit</button>

      <p className="text-[12px] text-center">Don't have an account?
        <span className="ml-1 underline font-bold" > Sign Up</span>
      </p>
    </form>

    </div>

    </div>
);
}
