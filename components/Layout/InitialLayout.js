import React from "react";
import { signIn } from "next-auth/react";

export const InitialLayout = () => {
  return (
    <div className="bg-bgGray w-screen h-screen flex items-center">
      <div className="text-center w-full">
        <button
          className="bg-white px-4 py-2 rounded-lg"
          onClick={() => signIn("google")}
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};
