"use client";
import { Logo } from "@/app/svgs";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [isPassword, setIsPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();
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

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      let response = await signIn("credentials", {
        email: data?.email,
        password: data?.password,
        redirect: false,
      });
      setIsLoading(false);
      if (response.error) {
        alert("Invalid Credentials...");
      } else {
        router.replace("/duty");
      }
    } catch (error) {
      console.error("error", error);
    }
  };

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
              className=" focus:outline-none border border-gray-300 text-gray-900 text-sm rounded-md  focus:ring-top-queue-bg block w-full p-5  "
              placeholder="Enter Email"
              {...register("email", {
                required: "Please enter email",
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <span className=" text-red-900 text-xs font-medium">
                {errors?.email?.message || "Error"}
              </span>
            )}
          </div>
          <div className="mb-16">
            <label className="block mb-2 text-base font-medium text-black ">
              Password
            </label>
            <div className="border  focus:ring-top-queue-bg   border-gray-300 text-gray-900 rounded-md  w-full p-5 flex justify-between items-center">
              <input
                type={!isPassword ? "password" : "text"}
                id="password"
                className=" text-sm  focus:outline-none block w-full"
                placeholder="Enter Password"
                {...register("password", {
                  required: "Please enter password",
                })}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault(); // Prevent default form submission
                    handleSubmit(onSubmit)(); // Manually trigger form submission
                  }
                }}
              />
              {isPassword ? (
                <FaEye
                  onClick={() => setIsPassword(!isPassword)}
                  className="text-gray-1 cursor-pointer"
                />
              ) : (
                <FaEyeSlash
                  onClick={() => setIsPassword(!isPassword)}
                  className="text-gray-1 cursor-pointer"
                />
              )}
            </div>

            {errors.password && (
              <span className=" text-red-900 text-xs font-medium">
                {errors?.password?.message || "Error"}
              </span>
            )}
            {/* <div>
              <span className="block my-5 text-base font-medium text-black float-right ">
                Forgot Password?
              </span>
            </div> */}
          </div>

          <button
            disabled={isLoading}
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className="text-black w-full bg-top-queue-bg hover:bg-yellow-500   font-medium rounded-md text-sm   px-5 p-5 text-center  "
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "Sign In"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
