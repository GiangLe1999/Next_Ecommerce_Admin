/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useSession } from "next-auth/react";

const Dashboard = () => {
  const { data: session } = useSession();
  if (!session) {
    return;
  }

  return (
    <div className="text-gray-800 flex-col md:flex md:flex-row justify-between pt-3 text-sm ">
      <h2 className="mb-2 md:mb-0">
        Welcome back, <b className="text-primary">{session?.user?.name}</b>
      </h2>
      <div className="flex items-center bg-gray-300 text-black gap-1 rounded-lg overflow-hidden">
        <img src={session?.user?.image} className="w-8 h-8" alt="User Avatar" />
        <span className="py-1 px-2">{session?.user?.email}</span>
      </div>
    </div>
  );
};

export default Dashboard;
