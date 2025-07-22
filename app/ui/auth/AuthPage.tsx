"use client";
import React, { useState,useRef, RefObject } from "react";
import { FcGoogle } from "react-icons/fc";
import { signinSchema, signupSchema, SigninState } from "@/app/lib/definitions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNotification } from "@/app/context/NotificationContext";
import { makeRequest } from "@/app/lib/helperFunctions";
import { useAuth } from "@/app/context/AuthContext";
import FormLoading from "@/app/components/Loaders/FormLoading";
import { useRouter } from "next/navigation";
// import { greatVibes } from "@/app/lib/font/fonts";
import { Great_Vibes } from "next/font/google";
import Link from "next/link";

type SigninInput = z.infer<typeof signinSchema>;
type SignupInput = z.infer<typeof signupSchema>;

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loginPending, setLoginPending] = useState<boolean>(false);
  const [signupPending, setSignupPending] = useState<boolean>(false);
  const { showToast } = useNotification();
  const { login, createSession } = useAuth();
  const ref = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const {
    register: registerSignin,
    handleSubmit: handleSigninSubmit,
    formState: { errors: signinErrors },
    reset: resetSignin,
  } = useForm<SigninInput>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(signinSchema),
  });

  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
    reset: resetSignup,
  } = useForm<SignupInput>({
    defaultValues: { email: "", password: "", name: "" },
    resolver: zodResolver(signupSchema),
  });

  const onSigninSubmit = async (data: any) => {
    console.log(data, rememberMe);
    try {
      setLoginPending(true);
      const res = await makeRequest(`/api/users/auth?service=signin`, {
        method: "POST",
        body: JSON.stringify({ ...data, rememberMe }),
      });
      if (!res.success) {
        setLoginPending(false);
        showToast(res.message, "error");
        return;
      }

      setLoginPending(false);
      showToast(res.message, "success");
      const userSession = {
        id: res.user.id,
        email: res.user.email,
        role: res.user.role,
        password: "",
        name: res.user.name,
        email_verified: res.user.email_verified === 0 ? false : true,
      }
      if(!rememberMe)
      createSession(userSession);
      resetSignin();
      router.replace("/");
    } catch (error: any) {
      setLoginPending(false);
      showToast(error.message, "error");
    }
  };

  const onSignupSubmit = async (data: any) => {
    console.log(data);
    try {
      setSignupPending(true);
      const res = await makeRequest(`/api/users/auth?service=signup`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!res.success) {
        setSignupPending(false);
        showToast(res.message, "error");
        return;
      }

      setSignupPending(false);
      showToast(res.message, "success");
      resetSignup();
      if(ref.current){
        ref.current.click()
      }
    } catch (error: any) {
      setSignupPending(false);
      showToast(error.message, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] text-[#FFD700] p-6">
      <div className="w-full max-w-md bg-[#2a2a2a] rounded-xl p-6 shadow-lg overflow-hidden">
        <div className="flex justify-between mb-6 border-b border-[#FFD700]">
          <button
            className={`w-1/2 py-2 font-bold transition-all duration-300 ${
              isLogin
                ? "text-[#FFD700] border-b-2 border-[#FFD700]"
                : "text-[#888]"
            } cursor-pointer`}
            onClick={() => setIsLogin(true)}
            ref={ref}
          >
            Sign In
          </button>
          <button
            className={`w-1/2 py-2 font-bold transition-all duration-300 ${
              !isLogin
                ? "text-[#FFD700] border-b-2 border-[#FFD700]"
                : "text-[#888]"
            } cursor-pointer`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <div className="relative w-full h-auto overflow-hidden">
          <h1 className="text-center">
            <span className={`${greatVibes.className} text-3xl`}>craft</span>
            SPACES
          </h1>
          <div
            className="flex transition-transform duration-500 ease-in-out w-[200%]"
            style={{ transform: `translateX(${isLogin ? "0%" : "-50%"})` }}
          >
            {/* Sign In Form */}
            <form
              onSubmit={handleSigninSubmit(onSigninSubmit)}
              className="w-1/2 space-y-4 pr-4"
            >
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full p-3 bg-[#1a1a1a] border border-[#FFD700] rounded-md mb-3"
                  {...registerSignin("email")}
                />
                {signinErrors.email && (
                  <p className="text-red-500 text-sm">
                    {signinErrors.email.message as string}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-3 bg-[#1a1a1a] border border-[#FFD700] rounded-md mb-3"
                  {...registerSignin("password")}
                />
                {signinErrors.password && (
                  <p className="text-red-500 text-sm">
                    {signinErrors.password.message as string}
                  </p>
                )}
              </div>
              <div className="w-full flex justify-between items-center text-xs md:text-base">
                <label className="label">
                  <input
                    type="checkbox"
                    defaultChecked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="checkbox border border-[#FFD700] w-5 h-5 text-amber-400"
                  />
                  Remember me
                </label>
                <Link href="/auth/forgot-password">Forgot Password</Link>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#FFD700] text-black font-bold rounded-md hover:bg-yellow-400 transition duration-300 cursor-pointer"
              >
                {loginPending ? <FormLoading /> : "Sign In"}
              </button>
              {/* <div className="flex items-center justify-center gap-2">
                <span className="text-sm">or</span>
                <button
                  disabled={loginPending}
                  className="flex items-center gap-2 text-white bg-[#1a1a1a] border border-[#FFD700] px-4 py-2 rounded-md hover:bg-[#333] transition duration-300"
                >
                  <FcGoogle size={20} /> Login with Google
                </button>
              </div> */}
            </form>

            {/* Sign Up Form */}
            <form
              onSubmit={handleSignupSubmit(onSignupSubmit)}
              className="w-1/2 space-y-4 pl-4"
            >
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full p-3 bg-[#1a1a1a] border border-[#FFD700] rounded-md mb-3"
                  {...registerSignup("name")}
                />
                {signupErrors.name && (
                  <p className="text-red-500 text-sm">
                    {signupErrors.name.message as string}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full p-3 bg-[#1a1a1a] border border-[#FFD700] rounded-md mb-3"
                  {...registerSignup("email")}
                />
                {signupErrors.email && (
                  <p className="text-red-500 text-sm">
                    {signupErrors.email.message as string}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-3 bg-[#1a1a1a] border border-[#FFD700] rounded-md mb-3"
                  {...registerSignup("password")}
                />
                {signupErrors.password && (
                  <p className="text-red-500 text-sm">
                    {signupErrors.password.message as string}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FFD700] text-black font-bold rounded-md hover:bg-yellow-400 transition duration-300 cursor-pointer"
              >
                {signupPending ? <FormLoading /> : "Sign Up"}
              </button>
              {/* <div className="flex items-center justify-center gap-2">
                <span className="text-sm">or</span>
                <button className="flex items-center gap-2 text-white bg-[#1a1a1a] border border-[#FFD700] px-4 py-2 rounded-md hover:bg-[#333] transition duration-300">
                  <FcGoogle size={20} /> Login with Google
                </button>
              </div> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
