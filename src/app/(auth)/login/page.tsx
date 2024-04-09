"use client";
import { Logo } from "@/app/svgs";
import React, { useEffect, useState } from "react";

const Login = () => {
  const [width, setWidth] = useState("w-1/3");
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1076) {
        setWidth("w-1/3");
      } else {
        setWidth("w-full");
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className="overflow-x-auto bg-white h-screen overflow-y-scroll mx-auto ">
      <div className=" flex items-center justify-center m-14">
        <Logo />
      </div>
      <div className="flex items-center justify-center mt-20 p-5">
        <div className={`border border-gray-300 p-10 rounded-lg ${width} `}>
          <div className=" border-b-1 border-gray-300 pb-5 mb-5">
            <span className="text-xl font-bold ">Login your account</span>
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-base font-medium text-black ">
              Email address
            </label>
            <input
              type="email"
              id="email"
              className=" border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-top-queue-bg block w-full p-5  "
              placeholder="john.doe@company.com"
              required
            />
          </div>
          <div className="mb-16">
            <label className="block mb-2 text-base font-medium text-black ">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-top-queue-bg  block w-full p-5 "
              placeholder="•••••••••"
              required
            />
            <div>
              <span className="block my-5 text-base font-medium text-black float-right ">
                Forgot Password?
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="text-white w-full bg-top-queue-bg hover:bg-yellow-500   font-medium rounded-md text-sm   px-5 p-5 text-center  "
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
