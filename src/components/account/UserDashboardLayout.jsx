import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { RiArrowLeftSLine, RiMenu5Fill } from "react-icons/ri";
import Image from "next/future/image";
import Link from "next/link";
import SlideOver from "./SlideOver";
import Sidebar from "./Sidebar";

function SidebarLink({ href = "#", icon: Icon, title = "" }) {
  const { pathname } = useRouter();
  return (
    <li
      className={`rounded-lg hover:bg-[#185ADB]/10 ${pathname === href ? "bg-[#185ADB]/10" : ""
        }`}
    >
      <Link href={href}>
        <a className="flex items-center space-x-3 p-2.5">
          {<Icon className="h-6 w-6 text-primary" />}
          <span className="text-sm font-medium text-dark">{title}</span>
        </a>
      </Link>
    </li>
  );
}
function UserDashboardLayout({ children }) {
  const { asPath, back } = useRouter();
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const toggleMenu = () => {
    setSideMenuOpen((old) => !old);
  };

  useEffect(() => {
    setSideMenuOpen(false);
  }, [asPath]);

  return (
    <>
      <SlideOver
        title="Navigation Menu"
        isOpen={sideMenuOpen}
        onClose={() => setSideMenuOpen(false)}
      >
        <Sidebar />
      </SlideOver>

      <div className="container relative min-h-screen bg-gray-50 p-0 lg:h-screen lg:overflow-hidden">
        <header className="sticky top-0 z-50 w-full border-b border-gray-50/10 bg-primary lg:hidden">
          <div className="flex items-center px-4 py-2">
            <Link href="/">
              <img
                src={"/images/app-logo.png"}
                width={160}
                height={90}
                className="cursor-pointer w-28 object-contain object-left py-1 lg:object-center"
                alt="Logo"
              />
            </Link>
            {/*menu button for mobile only*/}
            <div className="ml-auto lg:hidden">
              <button
                onClick={() => setSideMenuOpen(true)}
                className="rounded-md p-2 hover:bg-black/10"
              >
                <RiMenu5Fill className="text-white" size={28} />
              </button>
            </div>
          </div>
        </header>

        {/*for desktop*/}
        <div className="absolute inset-y-0 left-0 hidden w-80 overflow-hidden bg-white p-4 md:pb-2 lg:block">
          <Sidebar />
        </div>

        <div className="h-full scrollbar-thin scrollbar-thumb-gray-200 lg:pl-80">
          <div className="p-5">
            <button
              className="flex items-center text-dim hover:text-body"
            >
              <RiArrowLeftSLine className="h-5 w-5 shrink-0 rounded-md border border-gray-200" />
              <span className="ml-2 font-medium" onClick={back}>Back</span>
            </button>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

const Child = () => {
  return <></>;
};
export default UserDashboardLayout;
