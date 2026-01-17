import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// Schema
const LoginSchema = z
  .object({
    emailId: z.string().email("Invalid email address"),
    password: z.string().min(8, "Please enter a valid password"),
  })

export default function Loginpage() {
  const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: zodResolver(LoginSchema), });

  const submittedData = (data) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center mx-auto bg-linear-to-bl from-[#ffe4e6]  to-[#ccfbf1]">
    
    <div className="border-red-300 border-2  flex flex-col p-11 bg-linear-to-bl from-[#0f172a] via-[#1e1a78] to-[#0f172a] rounded-2xl">
    
    <h1 className="text-4xl font-bold text-center">Log In to LeetLab</h1>
    <p className="text-center font-light mt-1">Sign in to continue your coding journey.</p>

    <form onSubmit={handleSubmit(submittedData)} className="flex flex-col mt-5 gap-4">
              
      <div>
      <p className="text-[15px] mb-1">Email</p>
      <input {...register("emailId")}
        placeholder="Email" className="rounded-[10px] border p-2 w-105" />
        <p className="text-red-400 font-light">{errors.emailId?.message}</p>
      </div>

      <div>
      <p className="text-[15px] mb-1">Password</p>
      <input type="password" {...register("password")}
        placeholder="Password" className="rounded-[10px] border p-2 w-105"/>
        <p className="text-red-400 font-light">{errors.password?.message}</p>
      </div>

      <button type="submit" className="btn mt-5 btn-dash btn-accent">Submit</button>

      <p className="text-[12px] text-center">Don't have an account?
        <span className="ml-1 underline font-bold"><a href="https://www.youtube.com/"> Sign Up</a></span>
      </p>
    </form>

    </div>

    </div>
);
}
