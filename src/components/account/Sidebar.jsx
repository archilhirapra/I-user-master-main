import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Progress from "./Progress";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  RiAccountCircleFill,
  RiCalendarFill,
  RiHome3Fill,
  RiLock2Fill,
  RiLogoutCircleRFill,
  RiMapPin2Fill,
  RiVipCrownFill,
  RiVipDiamondFill,
} from "react-icons/ri";
import React, { useState } from "react";
import { useAuth } from "src/hooks/useAuth";
import { useEffect } from "react";

function SidebarLink({ href = "#", icon: Icon, title = "", onItemClick }) {
  const { pathname } = useRouter();
  return (
    <li
      onClick={onItemClick}
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

function Sidebar() {

  const router = useRouter();
  const auth = useAuth();
  const [userData, setUserData] = useState(auth.user);

  // const [haveMembership, setHaveMembership] = useState(false)
  const [membershipDetail, setMembershipDetail] = useState(null)
  const [subscriptionDetail, setSubscriptionDetail] = useState(null)



  useEffect(() => {
    setMembershipDetail(userData?.membershipDetail?.[0])
    setSubscriptionDetail(userData?.subscriptionDetail?.[0])
  }, [auth])


  const logOutClick = () => {
    auth.logout();
  }

  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = () => {
    const textField = document.createElement('textarea');
    textField.innerText = userData?.referral || '';
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 3000);}

  return (
    <div className="flex h-full w-full shrink-0 flex-col">
      <div className="relative flex shrink-0 flex-wrap-reverse items-center justify-between gap-2 overflow-hidden rounded-lg bg-gradient-to-b from-[#185ADB]/70 to-[#185ADB] px-4 py-3.5 text-white">
        <div className="relative z-[1]">
          <Link href="/account/details">
            <p className="cursor-pointer font-medium">{(userData?.name ? userData.name : 'Please Update your Name')}</p>
          </Link>
          <Link href="/account/details">
            <p className="cursor-pointer" >{(userData?.mobileNo ? (userData.mobileNo) : (userData?.email ? (userData.email) : 'email'))}</p>
            {/* <p>{userData?.email}</p> */}
          </Link>
        </div>
        {membershipDetail && (
          <div className="flex items-center rounded-full bg-white py-2 px-3 font-semibold text-[#FFB400]">
            <RiVipCrownFill className="h-6 w-6 text-[#FFB400]" />
            <span className="px-2">VIP</span>
          </div>
        )}



        <svg
          className="absolute inset-x-0 bottom-0"
          viewBox="0 0 410 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M410 14.1667L396.851 13.8889C382.507 13.3333 355.015 12.5 327.522 11.9444C301.224 11.3889 273.732 11.3889 246.239 11.3889C218.746 11.3889 191.254 11.3889 163.761 11.9444C136.268 12.5 108.776 13.3333 82.4781 11.3889C54.9854 9.44444 27.4927 4.72222 13.1487 2.22222L2.74181e-06 -9.53674e-07V20H13.1487C27.4927 20 54.9854 20 82.4781 20C108.776 20 136.268 20 163.761 20C191.254 20 218.746 20 246.239 20C273.732 20 301.224 20 327.522 20C355.015 20 382.507 20 396.851 20H410V14.1667Z"
            fill="#5697FF"
          />
        </svg>
      </div>

      <div className="relative mt-3 shrink-0 overflow-hidden rounded-lg bg-white p-4 shadow-[0_0_12px_rgba(0,0,0,0.08)]">
        <svg
          className="absolute inset-x-0 top-0"
          viewBox="0 0 409 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 11.0833L13.1166 11.6111C27.4257 12.6667 54.8513 14.25 82.277 15.3056C108.51 16.3611 135.936 16.3611 163.362 16.3611C190.787 16.3611 218.213 16.3611 245.638 15.3056C273.064 14.25 300.49 12.6667 326.723 16.3611C354.149 20.0556 381.574 29.0278 395.883 33.7778L409 38V0H395.883C381.574 0 354.149 0 326.723 0C300.49 0 273.064 0 245.638 0C218.213 0 190.787 0 163.362 0C135.936 0 108.51 0 82.277 0C54.8513 0 27.4257 0 13.1166 0H0V11.0833Z"
            fill="#D7E4FD"
          />
        </svg>

        <div className="z-[1]">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-dark/60 to-dark p-2">
              <RiVipDiamondFill className="h-8 w-8 text-white" />
            </div>
            <div className="w-max">
              <p className="text-sm font-medium text-dark/70">{membershipDetail ? ('VIP Membership') : (subscriptionDetail ? ('Subscription') : 'No Plan purchased')}</p>
              <p className="font-bold">{membershipDetail ? (membershipDetail?.membershipData?.[0]?.name) : (subscriptionDetail ? (subscriptionDetail?.subscriptionData?.[0]?.name) : '')}</p>
            </div>
            {/* <ChevronRightIcon className="h-4 w-4 stroke-[3] text-blue-500" /> */}
          </div>
          {subscriptionDetail && (
            <div className="mt-5 text-sm">
              <div className="flex justify-between">
                <span className="text-dark/60">{subscriptionDetail?.subscriptionData?.[0].pickup} Pickup</span>
                <span className="font-bold text-dark/70">{subscriptionDetail?.pickup} Pickup Left</span>
              </div>
              <div className="mt-1">
                <Progress variant="blue" total={subscriptionDetail?.subscriptionData?.[0].pickup} current={subscriptionDetail?.pickup} />
              </div>
              <div className="mt-5 flex justify-between">
                <span className="text-dark/60">{subscriptionDetail?.subscriptionData?.[0].delivery} Delivery</span>
                <span className="font-bold text-dark/70">{subscriptionDetail?.delivery} Delivery Left</span>
              </div>
              <div className="mt-1">
                <Progress variant="black" total={subscriptionDetail?.subscriptionData?.[0].delivery} current={subscriptionDetail?.delivery} />
              </div>
            </div>
          )}

          <button onClick={() => router.push('/subscription')} className="mt-4 w-full rounded-lg bg-[#FFA700] p-3 text-sm font-semibold text-white hover:bg-[#FFA700]/80">
            {membershipDetail ? 'Upgrade' : (subscriptionDetail ? 'Upgrade' : 'Buy Subscription Plan')}
          </button>
          {/* <div className="mt-4 space-y-1" >
            <div className="text-base font-medium">
              Referral Code
            </div>
            <div className="text-lg">
              {userData?.referral ? (userData?.referral) : ("Not Available")}
            </div>
          </div> */}
           <div className="mt-4 space-y-1">
      <div className="text-base font-medium">
        Referral Code
      </div>
      <div className="flex items-center space-x-2">
        <div className="text-lg font-medium bg-amber-200 p-2 border-dotted border-2 border-amber-500">
          {userData?.referral || 'Not Available'}
        </div>
        <button
          className="btn-secondary"
          onClick={copyToClipboard}
        >
          {copySuccess ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
        </div>
      </div>

      <div className="mt-4 grow overflow-auto scrollbar-thin">
        <ul className="h-full space-y-1">
          <SidebarLink href="/" icon={RiHome3Fill} title="Homepage" />
          <SidebarLink
            href="/account/bookings"
            icon={RiCalendarFill}
            title="Orders"
          />
          <SidebarLink href="/account/subscriptions" icon={RiVipDiamondFill} title="Subscriptions" />
          <SidebarLink
            href="/account/details"
            icon={RiAccountCircleFill}
            title="Account Details"
          />
          <SidebarLink
            href="/account/saved-address"
            icon={RiMapPin2Fill}
            title="Saved Addresses"
          />
          <SidebarLink
            href="/account/change-password"
            icon={RiLock2Fill}
            title="Change Password"
          />
          <SidebarLink
            icon={RiLogoutCircleRFill}
            title="Sign Out"
            onItemClick={() => logOutClick()}
          />
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
