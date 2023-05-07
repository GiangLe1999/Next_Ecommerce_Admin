import React, { useState } from "react";

import Nav from "@/components/Layout/Nav";
import { HamburgerIcon } from "./NavIcon";
import { Logo } from "./Logo";

const LoggedInLayout = (props) => {
  const [showNav, setShowNav] = useState(false);

  return (
    <div className="bg-bgGray min-h-screen">
      <div className="md:hidden flex items-center p-4">
        <button onClick={() => setShowNav(true)}>
          <HamburgerIcon />
        </button>
        <div className="flex grow justify-center mr-6">
          <Logo />
        </div>
      </div>

      <div className="flex">
        <Nav show={showNav} setShowNav={setShowNav} />

        <div className="flex-grow md:pl-56 p-6">{props.children}</div>
      </div>
    </div>
  );
};

export default LoggedInLayout;
