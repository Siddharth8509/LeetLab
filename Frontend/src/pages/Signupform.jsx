import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {useNavigate} from "react-router-dom"
import { useDispatch,useSelector } from "react-redux";
import { registerUser } from "../authSlice";
import { useEffect } from "react";

// Schema
const signupSchema = z
  .object({
    firstname: z.string().min(3, "Please enter valid first name"),
    lastname: z.string().min(3, "Please enter valid last name"),
    emailId: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmedPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: "Passwords do not match",
    path: ["confirmedPassword"],
  });

export default function Signupform() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated,loading,error } = useSelector((state) => state.auth);
  useEffect(()=>{
    if(isAuthenticated)
    {
      navigate("/");
    }
  },[isAuthenticated,navigate])
  
  

  const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: zodResolver(signupSchema), });
  
  const onSubmit = (data) => {
  const { confirmedPassword, ...payload } = data;
  dispatch(registerUser(payload));
};

  return (
    <div className="min-h-screen flex items-center justify-center mx-auto bg-linear-to-bl from-[#ffe4e6]  to-[#ccfbf1]">
    
    <div className="border-red-300 border-2  flex flex-col p-11 bg-linear-to-bl from-[#0f172a] via-[#1e1a78] to-[#0f172a] rounded-2xl">
    
    <h1 className="text-4xl font-bold text-center">Create Account</h1>
    <p className="text-center font-light mt-1">Start your coding journey with LeetLab</p>

    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mt-5 gap-4">
      
      <div className="flex gap-5">
        <div>
          <p className="text-[15px] mb-1">First Name</p>
          <input {...register("firstname")}
            placeholder="First Name" className="border rounded-[10px] p-2" />
            <p className="text-red-400 font-light">{errors.firstName?.message}</p>
        </div>
        <div>
          <p className="text-[15px] mb-1">Last Name</p>
          <input {...register("lastname")}
            placeholder="Last Name" className=" border rounded-[10px] p-2" />
            <p className="text-red-400 font-light">{errors.lastName?.message}</p>
        </div>
      </div>

      <div>
      <p className="text-[15px] mb-1">Email</p>
      <input type="email" {...register("emailId")}
        placeholder="Email" className="rounded-[10px] border p-2 w-105" />
        <p className="text-red-400 font-light">{errors.emailId?.message}</p>
      </div>

      <div>
      <p className="text-[15px] mb-1">Password</p>
      <input type="password" {...register("password")}
        placeholder="Password" className="rounded-[10px] border p-2 w-105"/>
        <p className="text-red-400 font-light">{errors.password?.message}</p>
      </div>

      <div>
      <p className="text-[15px] mb-1">Confirmed Password</p>
      <input type="password" {...register("confirmedPassword")}
        placeholder="Confirm Password" className="rounded-[10px] border p-2 w-105"/>
        <p className="text-red-400 font-light">{errors.confirmedPassword?.message}</p>
      </div>

      <button type="submit" disabled={loading} className="btn mt-5 btn-dash btn-accent">
        {loading ? "Creating..." : "Submit"}
      </button>

      <p className="text-[12px] text-center cursor-pointer">Already have an account?
        <span className="ml-1 underline font-bold" onClick={() => navigate("/login")}>Sign in</span>
      </p>
    </form>

    </div>

    </div>
);
}
