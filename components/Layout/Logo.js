import React from "react";
import Link from "next/link";

export const Logo = (props) => {
  return (
    <Link
      href="/"
      className="flex items-center gap-1"
      onClick={() => {
        props.setShowNav(false);
      }}
    >
      <span className="font-bold text-2xl text-primary">Admin Panel</span>
    </Link>
  );
};
