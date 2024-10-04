"use client";

import { GenericButton } from "@/app/_components";
import React, { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useCreateErrorMutation } from "@/app/_utils/redux/slice/emptySplitApi";

// Define the shape of the error response
interface ErrorResponse {
  success: boolean;
  description: string;
  content: any;
}

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  const [createError] = useCreateErrorMutation();

  const addError = async () => {
    const payload = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      digest: error.digest,
    };

    try {
      const response = await createError(payload);

      if ("data" in response) {
        // Handle successful response
        const responseData = response.data as ErrorResponse;
        if (responseData.success) {
          console.log("Success:", responseData.description);
        } else {
          console.error("Failed to log error:", responseData.description);
        }
      } else if ("error" in response) {
        // Handle error response
        console.error("Error creating error:", response.error);
      }
    } catch (error) {
      console.error("Error while handling error:", error);
    }
  };

  useEffect(() => {
    addError();
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2>Something went wrong</h2>
      <div className="w-40 mt-5">
        <GenericButton
          text="Reset"
          onClick={() => {
            signOut({
              callbackUrl: "/login",
              redirect: true,
            });
          }}
        />
      </div>
    </div>
  );
}
