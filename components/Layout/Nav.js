import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

import {
  AdminIcon,
  CategoriesIcon,
  DashboardIcon,
  LogoutIcon,
  OrderIcon,
  ProductIcon,
  SettingIcon,
} from "./NavIcon";
import { Logo } from "./Logo";

const Nav = (props) => {
  const router = useRouter();
  const { pathname } = router;

  const inactiveLink = "flex gap-1 py-2 pl-2 mr-4 rounded-md";
  const activeLink = inactiveLink + " text-primary bg-highlight";

  const logoutHandler = async () => {
    props.setShowNav(false);
    await router.push("/");
    await signOut();
  };

  return (
    <aside
      className={`text-gray-500 p-4 pr-0 fixed w-full h-full top-0 bg-bgGray md:left-0 md:w-auto transition-all ${
        props.show ? "left-0" : "-left-full"
      }`}
    >
      <div className="mb-6 mr-2 pt-4 pl-2 pr-5 relative">
        <Logo setShowNav={props.setShowNav} />
        <button
          onClick={() => {
            props.setShowNav(false);
          }}
          className="absolute right-1.5 top-4 text-sm hover:underline hover:text-primary md:hidden"
        >
          Close
        </button>
      </div>
      <nav className="flex flex-col gap-2">
        <Link
          href="/"
          className={pathname === "/" ? activeLink : inactiveLink}
          onClick={() => {
            props.setShowNav(false);
          }}
        >
          <DashboardIcon />
          Dashboard
        </Link>
        <Link
          href="/products"
          className={pathname.includes("/products") ? activeLink : inactiveLink}
          onClick={() => {
            props.setShowNav(false);
          }}
        >
          <ProductIcon />
          Products
        </Link>
        <Link
          href="/categories"
          className={
            pathname.includes("/categories") ? activeLink : inactiveLink
          }
          onClick={() => {
            props.setShowNav(false);
          }}
        >
          <CategoriesIcon />
          Categories
        </Link>
        <Link
          href="/orders"
          className={pathname.includes("/orders") ? activeLink : inactiveLink}
          onClick={() => {
            props.setShowNav(false);
          }}
        >
          <OrderIcon />
          Orders
        </Link>
        <Link
          href="/admins"
          className={pathname.includes("/admins") ? activeLink : inactiveLink}
          onClick={() => {
            props.setShowNav(false);
          }}
        >
          <AdminIcon />
          Admins
        </Link>
        <Link
          href="/settings"
          className={pathname.includes("/settings") ? activeLink : inactiveLink}
          onClick={() => {
            props.setShowNav(false);
          }}
        >
          <SettingIcon />
          Settings
        </Link>
        <button className="flex gap-1 pl-2 py-2" onClick={logoutHandler}>
          <LogoutIcon />
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Nav;
