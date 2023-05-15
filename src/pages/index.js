import Image from "next/future/image";
import React, { useEffect, useState } from "react";
// ** Next Imports
import { useRouter } from "next/router";
import subscriptionConfig from "src/configs/subscriptionConfig";
//seo
import { HomeSeo } from "../seo/seo";
// ** Spinner Import
// import Spinner from 'src/@core/components/spinner'

// ** Hook Imports
import { useAuth } from "src/hooks/useAuth";
import Modal from "../components/Modal";
import AuthPages from "../components/Auth/AuthPages";
import HeaderHome from "../components/HeaderHome";
import {
  RiCalendarFill,
  RiDoubleQuotesL,
  RiFacebookBoxFill,
  RiInstagramFill,
  RiLinkedinBoxFill,
  RiMailSendFill,
  RiMapPin2Fill,
  RiMapPin5Fill,
  RiPinterestFill,
  RiShieldCheckFill,
  RiShieldStarFill,
  RiShieldUserFill,
  RiStarFill,
  RiTimeFill,
  RiTwitterFill,
  RiYoutubeFill
} from "react-icons/ri";
import axios from "axios";
import LoadingSpinner from "src/components/LoadingSpinner";
import { useRef } from "react";
import miscApiConfigs from "src/configs/miscApiConfigs";
import { AboutUsModalContent } from "src/shared/AboutUsModalContent";
import { TermsAndConditionsModalContent } from "src/shared/TermsAndConditionsModalContent";
import { PrivacyPolicyModalContent } from "src/shared/PrivacyPolicyModalContent";
import Link from "next/link";
import Footer from "src/components/Footer";
import authConfig from "../configs/auth";
import AlertDialog from "../components/AlertDialog";
// import ChooseLocation from "src/components/ChooseLocation";
//demo data

export const getHomeRoute = (role) => {
  if (role === "user") return "/home";
  else return "/dashboards/crm";
};

const services = [
  {
    name: "Dry Cleaning",
    price: "$10.52",
    discount: "20%",
    imageUrl: "/images/img-dry-clean.png"
  },
  {
    name: "Laundry",
    price: "$10.52",
    discount: "20%",
    imageUrl: "/images/img-laundry.png"
  },
  {
    name: "Leather & Suede",
    price: "$10.52",
    discount: "20%",
    imageUrl: "/images/img-leather.png"
  },
  {
    name: "Alterations",
    price: "$10.52",
    discount: "20%",
    imageUrl: "/images/img-alterations.png"
  },
  {
    name: "Household",
    price: "$10.52",
    discount: "20%",
    imageUrl: "/images/img-household.png"
  },
  {
    name: "Shoe Repair",
    price: "$10.52",
    discount: "20%",
    imageUrl: "/images/img-shoe.png"
  }
];

const Home = () => {
  const auth = useAuth();
  const router = useRouter();

const [isLoggedIn, setIsLoggedIn] = useState(false);
useEffect(() => {
  if (window.localStorage.getItem("accessToken")) {
    setIsLoggedIn(true);
  } else {
    setIsLoggedIn(false);
  }
  fetchAllSubscriptions();
  fetchMembershipDetails();
  fetchAppLink();
  isLoggedIn && fetchCheckForSubScription();
}, []);

  const [openAlert, setOpenAlert] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("confirm");
  const [msg, setMsg] = useState("");
  const [isSubsPackagesLoading, setIsSubsPackagesLoading] = useState(false);
  const [isDeluxPackagesLoading, setIsDeluxPackagesLoading] = useState(false);
  const [subscriptionList, setSubscriptionList] = useState([]);
  const [membershipList, setMembershipList] = useState([]);
  const [membershipBenefits, setMembershipBenefits] = useState([]);

  const [appLink, setAppLink] = useState("");
  const fetchAppLink = async () => {
    // setIsSubsPackagesLoading(true);
    const response = await axios.get(miscApiConfigs.appLinkEndpoint);
    setAppLink(response.data.data.data);
    // setIsSubsPackagesLoading(false)
  };

  const fetchAllSubscriptions = async () => {
    setIsSubsPackagesLoading(true);
    const response = await axios.get(subscriptionConfig.getSubscriptionList);
    setSubscriptionList(response.data.data.data.slice(0, 3));
    setIsSubsPackagesLoading(false);
  };

  const fetchCheckForSubScription = async () => {
    const link = subscriptionConfig.checkIsSubscriptionIsCanceled;
    const storedToken =
      "Bearer " + window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      axios.get(link, {
        headers: {
          Authorization: storedToken
        }
      })
        .then(async (res) => {
          console.log("res", res);
        })
        .catch(async e => {
          console.log("error", e);
          setOpenAlert(true);
          setType("error");
          setTitle("Error");
          setMsg(e?.response?.data?.message);
        });
    } catch (e) {
      setOpenAlert(true);
      setType("error");
      setTitle("Error");
      setMsg(e?.response?.data?.message);
    }
  };

  const fetchMembershipDetails = async () => {
    setIsDeluxPackagesLoading(true);
    const response = await axios.get(
      subscriptionConfig.getMembershipDetails
      // ,
      // {
      //   headers: {
      //     "Content-Type": "application/json",
      //     // Authorization: "Bearer " + window.localStorage.getItem(authConfig.storageTokenKeyName)
      //     Authorization: "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzcxZjliODFkZjZiYTI5ODk4MWYxOTEiLCJyb2xlIjoidXNlciIsInRpbWUiOjE2NzEyNTI2NzU0MTAsImlhdCI6MTY3MTI1MjY3NSwiZXhwIjoxNzAyNzg4Njc1fQ.q7hCmk6YiJKffMGc1kTj5IFT5cq_IkpHP2ZrgD56QE0'
      //   }
      // }
    );
    setMembershipList(response.data.data.data);
    setMembershipBenefits(
      response?.data?.data?.data?.benefits.split(",").slice(1)
    );

    setIsDeluxPackagesLoading(false);
    // setMembershipDetails(response.data.data.data)
  };

  const [loginModalOpen, setLoginModalOpen] = useState(() => {
    return !!router.query.requireAuth ?? false;
  });

  const toggleLoginModal = () => {
    setLoginModalOpen((old) => !old);
  };
  const closeLoginModal = () => setLoginModalOpen(false);

  const [isLinkBeingSent, setIsLinkBeingSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState({
    value: "",
    error: false,
    errorMessage: "",
    countryCode: "+1",
    success: false
  });
  const onPhoneNumberChange = (event) => {
    setPhoneNumber((prev) => ({
      ...prev,
      value: event.target.value,
      error: false,
      errorMessage: "",
      countryCode: "+1"
    }));
  };

  const inputRef = useRef(null);

  const onSendAppLinkButtonClick = async () => {
    if (
      phoneNumber.value.length < 10 ||
      phoneNumber.value.length > 10 ||
      isNaN(phoneNumber.value)
    ) {
      setPhoneNumber({
        errorMessage: "Please enter a valid phone number",
        error: true
      });
      inputRef.current.focus();
    } else {
      try {
        setIsLinkBeingSent(true);
        await axios.get(
          miscApiConfigs.sendAppLink +
          `countryCode=${phoneNumber.countryCode}&mobileNo=${phoneNumber.value}`
        );

        inputRef.current.value = "";
        setPhoneNumber({
          success: true,
          errorMessage: "Link sent successfully! Please check your Inbox.",
          error: false
        });
      } catch (error) {
        inputRef.current.focus();
        setPhoneNumber((prev) => ({
          ...prev,
          errorMessage: "Something went wrong! Please try again later...",
          error: true
        }));
      }
    }
    setIsLinkBeingSent(false);
  };


  const [aboutUsModal, setAboutUsModal] = useState(false);
  const [termsAndConditionsModal, setTermsAndConditionsModal] = useState(false);
  const [privacyPolicyModal, setPrivacyPolicyModal] = useState(false);

  const closeDialog = () => {
    if (type == "success") {
      // reset()
    }
    setOpenAlert(false);
  };

  return (
    <>
      <AlertDialog
        isOpen={openAlert}
        onClose={closeDialog}
        type={type}
        title={title}
        content={msg}
      />
      <HomeSeo/>
      <Modal isOpen={loginModalOpen} onClose={closeLoginModal}>
        <AuthPages/>
      </Modal>
      <HeaderHome onClickLogin={toggleLoginModal} isLoggedIn={isLoggedIn}/>

      <Modal isOpen={aboutUsModal} onClose={() => setAboutUsModal(false)}>
        {AboutUsModalContent}
      </Modal>

      <Modal
        isOpen={termsAndConditionsModal}
        onClose={() => setTermsAndConditionsModal(false)}>
        {TermsAndConditionsModalContent}
      </Modal>

      <Modal
        isOpen={privacyPolicyModal}
        onClose={() => setPrivacyPolicyModal(false)}>
        {PrivacyPolicyModalContent}
      </Modal>

      <div className="bg-[#185adb]">
        <div className="container flex flex-col py-3 md:flex-row lg:gap-16">
          <div className="w-full py-4 lg:py-10">
            <h1 className="text-3xl font-bold text-white lg:text-5xl">
              <span className="text-[#FFE55E]">Experience and satisfaction in </span>
              every wash
            </h1>
            <p className="mt-3 max-w-lg text-white">
              Expert laundry and dry cleaning services for all types of fabrics.
            </p>
            <div className="shidden mt-8 lg:block">
              <h2 className="text-xl font-semibold text-white">
                Schedule your laundry items
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div
                  onClick={() => router.push("/services")}
                  className="cursor-pointer rounded-lg bg-white px-3 py-2">
                  <div className="mb-0.5 text-sm font-medium text-dark/70">
                    Pickup Address
                  </div>
                  <div className="flex items-center text-lg font-medium">
                    <RiMapPin2Fill size={18} className="mr-2 text-primary"/>
                    <span>Enter address</span>
                  </div>
                </div>
                <div
                  onClick={() => router.push("/services")}
                  className="cursor-pointer rounded-lg bg-white px-3 py-2">
                  <div className="mb-0.5 text-sm font-medium text-dark/70">
                    Pickup time slot
                  </div>
                  <div className="flex items-center text-lg font-medium">
                    <RiCalendarFill size={18} className="mr-2 text-primary"/>
                    <span>Pickup date</span>
                  </div>
                </div>
                <div
                  onClick={() => router.push("/services")}
                  className="cursor-pointer rounded-lg bg-white px-3 py-2">
                  <div className="mb-0.5 text-sm font-medium text-dark/70">
                    Delivery Address
                  </div>
                  <div className="flex items-center text-lg font-medium">
                    <RiMapPin2Fill size={18} className="mr-2 text-primary"/>
                    <span>Enter address</span>
                  </div>
                </div>
                <div
                  onClick={() => router.push("/services")}
                  className="cursor-pointer rounded-lg bg-white px-3 py-2">
                  <div className="mb-0.5 text-sm font-medium text-dark/70">
                    Delivery time slot
                  </div>
                  <div className="flex items-center text-lg font-medium">
                    <RiCalendarFill size={18} className="mr-2 text-primary"/>
                    <span>Delivery date</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex w-full gap-2">
                <button
                  onClick={() => router.push("/services")}
                  className="w-full rounded-lg bg-[#FFCA4A] px-3 py-4 text-lg font-medium">
                  Create Schedule
                </button>
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => router.push("/account/bookings")}
                      className="w-full rounded-lg border-2 border-[#FFCA4A] bg-transparent px-3 py-4 text-lg font-medium text-[#FFCA4A]">
                      My Account
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={toggleLoginModal}
                      className="w-full rounded-lg border-2 border-[#FFCA4A] bg-transparent px-3 py-4 text-lg font-medium text-[#FFCA4A]">
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="relative w-full">
            <svg
              className="absolute right-0 top-0 h-full w-full"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 859 625">
              <filter
                id="1337svg"
                width="878.244"
                height="645"
                x="-9.244"
                y="-10"
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="5"/>
                <feComposite
                  in2="SourceAlpha"
                  operator="in"
                  result="effect1_backgroundBlur_1908_8193"
                />
                <feBlend
                  in="SourceGraphic"
                  in2="effect1_backgroundBlur_1908_8193"
                  result="shape"
                />
              </filter>
              <g filter="url(#1337svg)">
                <path
                  fill="#FFDE26"
                  d="M422.708 24.326c5.022-8.858 7.533-13.287 11.074-16.51A29.992 29.992 0 0 1 444.64 1.49C449.19 0 454.281 0 464.464 0H811c16.802 0 25.202 0 31.62 3.27a29.997 29.997 0 0 1 13.11 13.11C859 22.798 859 31.198 859 48v529c0 16.802 0 25.202-3.27 31.62a29.994 29.994 0 0 1-13.11 13.11C836.202 625 827.802 625 811 625H83.41c-42.916 0-64.374 0-72.99-7.944a30 30 0 0 1-9.246-27.047c1.95-11.556 18.917-24.692 52.85-50.964l129.357-100.147c2.846-2.203 4.269-3.304 5.541-4.557a30.003 30.003 0 0 0 3.109-3.589c1.059-1.438 1.946-3.003 3.721-6.134L422.708 24.326Z"
                />
              </g>
            </svg>
            <div className="relative bottom-0 z-10 overflow-hidden">
              <img src="/images/lady.png" alt="" className="translate-y-3"/>
            </div>
          </div>
        </div>
      </div>
      <main className="bg-[#F8F8F8]">
        <div className="bg-white">
          <div className="container flex items-center justify-between gap-1 py-3 lg:gap-4 lg:py-6">
            <h2 className="text-base font-semibold lg:text-2xl">
              Our Services
            </h2>
            <div
              className="rounded-full border-2 border-dotted border-amber-400 px-2 py-1 text-sm font-medium lg:py-2 lg:px-4">
              {`"Instant pickup and delivery"`}
            </div>
          </div>
        </div>

        <div
          className="container grid grid-cols-2 gap-6 py-6 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-12 lg:py-12">
          {services.map((service, index) => (
            <div
              onClick={() => router.push("/services")}
              key={"service" + index}
              className="w-full cursor-pointer rounded-2xl md:flex md:overflow-hidden md:shadow-sm md:hover:shadow">
              <div
                className="mx-auto flex h-36 w-full max-w-[12rem] flex-col overflow-hidden rounded-2xl bg-white md:h-48 md:w-48 md:rounded-none">
                <div className="flex-1 overflow-hidden p-2 pb-4 md:p-0">
                  <div className="relative h-full rounded-xl bg-[#DAFFE9] md:rounded-none">
                    <img
                      fill
                      src={service.imageUrl}
                      className="h-full w-full object-contain p-3 md:p-8"
                      alt=""
                    />
                  </div>
                </div>

                <div className="shrink-0 bg-primary p-1 text-center font-semibold text-white">
                  {service.discount} OFF
                </div>
              </div>
              <div className="flex grow flex-col justify-center p-2 text-center md:bg-white md:p-10 md:text-start">
                <div className="font-bold md:text-xl">{service.name}</div>
                <div className="hidden text-primary md:block">
                  Starting from{" "}
                  <span className="font-semibold text-dark">
                    {service.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white">
          <div className="container pb-8">
            <h2 className="py-8 text-center text-xl font-semibold uppercase md:py-20 md:text-3xl">
              HOW IT WORKS: IN 4 EASY STEPS
            </h2>
            <div
              className="grid grid-cols-2 justify-center gap-y-10 gap-x-4 py-4 md:flex md:grid-cols-4 md:items-start md:gap-x-0">
              <div className="flex flex-col">
                <svg
                  className="h-16 md:h-28"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 172 143">
                  <path
                    fill="#568FFF"
                    d="M68 3.6c-2.534 1.334-6 4.934-8 8.4l-3.467 6-13.334.934c-7.2.533-14.533 1.333-16.266 1.733-3.334.8-8.267 5.2-8.267 7.334 0 .933 23.6 1.333 68.4 1.333l68.267-.133-3.734-3.2c-2.933-2.534-5.2-3.334-10.4-3.334-7.733 0-14.133-2.4-17.866-6.666-3.867-4.267-8.4-6.267-17.2-7.334-4.267-.533-10-2-12.667-3.466C85.999 1.334 73.733.534 67.999 3.6Z"
                  />
                  <path
                    fill="#185ADB"
                    stroke="#185ADB"
                    strokeWidth="2"
                    d="m2.84 37.508-.01.009-.008.009c-1.34 1.272-1.69 1.973-1.69 2.475 0 .5.35 1.203 1.69 2.475l.009.008.009.01c.082.081.272.224.763.382.494.159 1.231.313 2.346.453 2.23.281 5.81.489 11.643.639 11.65.3 32.135.366 68.407.366 36.273 0 56.757-.067 68.408-.366 5.832-.15 9.413-.358 11.643-.639 1.115-.14 1.852-.294 2.346-.453.491-.157.681-.3.763-.383l.009-.009.009-.008c1.339-1.272 1.689-1.974 1.689-2.475 0-.502-.35-1.203-1.689-2.475l-.009-.01-.009-.008c-.082-.082-.272-.225-.763-.383-.494-.158-1.231-.313-2.346-.453-2.23-.28-5.811-.488-11.643-.638-11.651-.3-32.135-.367-68.408-.367-36.272 0-56.756.067-68.407.367-5.832.15-9.413.357-11.643.638-1.115.14-1.852.295-2.346.453-.49.158-.681.3-.763.383Z"
                  />
                  <path
                    fill="#185ADB"
                    stroke="#185ADB"
                    strokeWidth="4"
                    d="m16.366 52.57.003.015.002.016c2.192 13.015 6.05 31.675 9.63 47.542 1.788 7.931 3.504 15.148 4.904 20.599.7 2.728 1.317 4.998 1.822 6.689.253.846.472 1.53.656 2.046.091.257.17.46.233.612.057.135.09.201.1.219 1.292 2.085 2.2 3.361 3.495 4.31 1.282.94 3.136 1.689 6.532 2.223C50.646 137.927 62.901 138 87.066 138c21.377 0 32.09-.001 38.028-.363 2.965-.181 4.586-.445 5.688-.785 1.031-.319 1.684-.723 2.742-1.428 2.163-1.572 4.997-4.789 6.172-7.022l.003-.007.004-.006.001-.003c.009-.02.044-.101.106-.272.073-.201.162-.471.267-.813.211-.682.469-1.599.769-2.727.601-2.253 1.354-5.289 2.206-8.861 1.702-7.139 3.786-16.371 5.81-25.656 2.023-9.283 3.983-18.608 5.436-25.932a409.561 409.561 0 0 0 1.74-9.208c.191-1.097.335-1.995.437-2.693-.757-.054-1.746-.108-2.967-.161-3.294-.143-8.165-.272-14.443-.38-12.551-.216-30.672-.35-52.933-.35H16.137l.229 1.236Z"
                  />
                </svg>
                <div className="home-step my-8">
                  <span>Step 1</span>
                </div>
                <div className="mx-auto max-w-[200px] text-center text-sm font-semibold md:text-lg">
                  <span className="text-primary">Bag</span> up all your dirty
                  clothes
                </div>
              </div>
              <svg
                className="mt-12 hidden w-36 md:block"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 212 48">
                <path
                  fill="#D3D3D3"
                  d="m99.898 46.5-.403.915.373.165.382-.144-.352-.936ZM211.31 5.366a1 1 0 0 0-.498-1.323L202.615.325a1 1 0 1 0-.826 1.822l7.286 3.304-3.304 7.286a1 1 0 0 0 1.821.826l3.718-8.197ZM.994 3.915l98.5 43.5.808-1.83-98.5-43.5-.808 1.83Zm99.256 43.521L210.751 5.889l-.704-1.872-110.5 41.547.703 1.872Z"
                />
              </svg>
              <div className="flex flex-col">
                <svg
                  className="h-16 md:h-28"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 199 143">
                  <path
                    fill="#185ADB"
                    d="M9.599 15.066c-.934 1.067-1.6 12.933-1.867 32.667l-.4 30.933h119.467l-.4-30.4c-.267-23.467-.8-31.067-2.267-32.667-1.6-2-7.333-2.266-57.467-2.266-44.266 0-56 .4-57.066 1.733Z"
                  />
                  <path
                    fill="#568FFF"
                    stroke="#568FFF"
                    strokeWidth="2"
                    d="m167.419 35.561-.034-.017-.033-.02-.034-.017a1.619 1.619 0 0 0-.112-.042 4.286 4.286 0 0 0-.398-.113 14.986 14.986 0 0 0-1.331-.241c-1.097-.158-2.548-.297-4.261-.413-3.422-.232-7.833-.365-12.416-.365H133V115h3.667c1.623 0 2.702-.166 3.422-.459.658-.268 1.019-.641 1.245-1.169.93-2.628 2.914-5.594 5.172-8.107 2.257-2.511 4.909-4.705 7.246-5.656 3.015-1.261 6.751-1.876 10.319-1.859 3.548.017 7.055.66 9.586 2.027 2.358 1.149 5.016 3.413 7.219 5.853 2.195 2.431 4.079 5.194 4.746 7.406.411 1.276 1.284 1.841 2.301 1.864 1.089.025 2.526-.579 3.857-2.091 1.433-1.655 1.89-3.766 1.621-11.571v-.004l-.365-8.994-5.666-.578h-.002c-3.198-.31-5.675-1.1-7.373-2.192-1.691-1.087-2.736-2.572-2.678-4.239.059-1.66 1.2-3.087 2.959-4.095 1.771-1.014 4.304-1.696 7.534-1.868h.004l5.853-.344v-5.99c0-4.287-.914-7.802-2.235-9.85-2.163-3.21-7.619-9.826-12.868-15.826-2.619-2.993-5.172-5.815-7.215-7.96a72.698 72.698 0 0 0-2.611-2.63 17.89 17.89 0 0 0-.885-.79 3.022 3.022 0 0 0-.434-.317ZM161.854 71.4h-.007L141.98 71l-.948-.02-.031-.946-.4-11.86v-.003c-.134-3.283-.168-6.469-.117-8.974.025-1.253.071-2.344.138-3.198.033-.426.072-.803.118-1.116.043-.294.101-.595.19-.834l.008-.022.01-.02c.173-.406.507-.654.747-.799.265-.16.578-.289.903-.398.653-.218 1.499-.4 2.449-.552 1.908-.304 4.378-.507 6.886-.59 2.51-.085 5.092-.052 7.228.123 1.066.087 2.041.211 2.849.38.763.159 1.505.381 2.016.734.542.357 1.253 1.036 2.037 1.865.812.859 1.769 1.95 2.805 3.188 2.076 2.475 4.499 5.565 6.782 8.609 2.282 3.042 4.432 6.051 5.958 8.366.76 1.154 1.379 2.155 1.781 2.91.199.372.365.721.465 1.017.048.144.1.328.113.522.01.153.018.58-.327.925a1.586 1.586 0 0 1-.599.356c-.169.06-.359.108-.554.148-.393.08-.899.15-1.488.209-1.185.12-2.798.212-4.714.28-3.838.133-8.955.167-14.431.1ZM64.603 109.908l.007.012 2.782 5.08h58.274V87.667h-118V91.2c0 .996.026 1.727.105 2.282.078.555.199.844.323 1.017.227.315.704.568 2.418.774 1.846.198 3.22 1.082 4.072 2.34.836 1.234 1.123 2.761.96 4.216-.327 2.898-2.52 5.838-6.345 5.838-.657 0-1.002.132-1.166.249-.122.088-.218.216-.235.511-.02.335.07.848.372 1.562.298.703.774 1.54 1.447 2.503.714 1.011 1.398 1.59 2.38 1.953 1.04.385 2.49.555 4.802.555 2.133 0 3.45-.138 4.212-.397.367-.124.516-.248.575-.317.04-.048.08-.116.08-.286 0-.584.21-1.207.48-1.789.281-.603.675-1.26 1.142-1.94.934-1.36 2.213-2.886 3.621-4.361 1.41-1.478 2.968-2.926 4.47-4.128 1.487-1.191 2.974-2.185 4.239-2.706 2.957-1.226 7.316-1.478 11.421-1.037 4.092.44 8.207 1.598 10.625 3.426 2.154 1.583 5.168 5.309 6.94 8.443Z"
                  />
                  <path
                    fill="#0A1931"
                    stroke="#0A1931"
                    strokeWidth="2"
                    d="m35.72 108.72-.01.006c-2.236 1.33-4.079 3.7-5.2 6.481-1.121 2.779-1.483 5.87-.87 8.571l.002.004c3.863 17.324 29.357 14.535 29.357-3.382 0-2.51-.17-4.003-.736-5.323-.57-1.328-1.582-2.581-3.505-4.503-1.852-1.853-3.11-2.873-4.432-3.46-1.307-.581-2.771-.781-5.127-.781-3.319 0-7.264 1.033-9.479 2.387ZM177.716 125.556l.001-.003c1.705-5.179.806-9.963-1.861-13.446-2.671-3.49-7.194-5.775-12.923-5.775-2.425 0-3.924.2-5.247.782-1.336.587-2.593 1.606-4.446 3.458-1.922 1.923-2.935 3.176-3.504 4.504-.566 1.32-.736 2.813-.736 5.323 0 8.371 5.872 13.585 12.457 14.748 6.583 1.163 13.706-1.747 16.259-9.591Z"
                  />
                  <circle cx="44" cy="122" r="3" fill="#D9D9D9"/>
                  <circle cx="164" cy="122" r="3" fill="#D9D9D9"/>
                </svg>
                <div className="home-step my-8">
                  <span>Step 2</span>
                </div>
                <div className="mx-auto max-w-[200px] text-center text-sm font-semibold md:text-lg">
                  Drop off or we
                  <span className="text-primary">{" pickup "}</span>
                  your clothes
                </div>
              </div>
              <svg
                className="mt-12 hidden w-36 -scale-y-100 md:block"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 212 48">
                <path
                  fill="#D3D3D3"
                  d="m99.898 46.5-.403.915.373.165.382-.144-.352-.936ZM211.31 5.366a1 1 0 0 0-.498-1.323L202.615.325a1 1 0 1 0-.826 1.822l7.286 3.304-3.304 7.286a1 1 0 0 0 1.821.826l3.718-8.197ZM.994 3.915l98.5 43.5.808-1.83-98.5-43.5-.808 1.83Zm99.256 43.521L210.751 5.889l-.704-1.872-110.5 41.547.703 1.872Z"
                />
              </svg>
              <div className="flex flex-col">
                <svg
                  className="h-16 md:h-28"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 112 143">
                  <path
                    fill="#185ADB"
                    d="M10.934 10.8c-2.667.8-5.333 2.933-6.933 5.6-2.534 4-2.667 6.933-2.667 58.267 0 40.533.4 54.8 1.733 57.333.934 1.867 3.734 4.4 6.267 5.6 4.133 2.133 9.333 2.4 46.4 2.4 44.667 0 48.267-.4 52.8-6.8 1.867-2.8 2.133-9.467 2.133-58.533 0-49.067-.266-55.734-2.133-58.534-4.533-6.4-8.133-6.8-52.133-6.666-22.534 0-43.067.666-45.467 1.333Zm56.667 34.933c9.066 3.334 16 9.734 20.4 18.8 3.866 7.867 4.266 9.734 3.733 17.2-.933 10.267-4.4 17.334-12.133 24.534-14.4 13.2-34.267 12.666-48.4-1.467-10.8-10.933-13.734-23.333-8.534-37.067 6.667-17.866 27.867-28.266 44.934-22Z"
                  />
                  <path
                    fill="#568FFF"
                    d="M42.535 55.065c-8.8 4.667-13.6 12.4-14.267 22.8-.534 7.467-.134 9.467 3.2 15.467 9.866 18.267 35.867 19.733 47.867 2.8 3.2-4.533 4-7.2 4.4-14.667.533-9.6-1.2-14.933-6.934-21.2-7.733-8.666-23.333-10.933-34.267-5.2Zm20.4.934c8.533 2.4 15.333 9.6 17.466 18.666.8 3.2.534 3.334-6.133 3.467-3.867.133-10.267.667-14.4 1.2-5.6.667-9.334.4-14.134-1.2-5.2-1.733-7.466-1.867-10.4-.8-2 .8-3.866 1.2-4.133.933-1.466-1.466 3.6-11.733 7.733-15.866 6.934-6.934 14.534-8.934 24-6.4Z"
                  />
                  <circle cx="74" cy="25" r="5" fill="#fff"/>
                  <circle cx="92.5" cy="28.5" r="8.5" fill="#fff"/>
                </svg>
                <div className="home-step my-8">
                  <span>Step 3</span>
                </div>
                <div className="mx-auto max-w-[200px] text-center text-sm font-semibold md:text-lg">
                  We <span className="text-primary">{" clean up "}</span> your
                  <br/>
                  clothes
                </div>
              </div>
              <svg
                className="mt-12 hidden w-36 md:block"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 212 48">
                <path
                  fill="#D3D3D3"
                  d="m99.898 46.5-.403.915.373.165.382-.144-.352-.936ZM211.31 5.366a1 1 0 0 0-.498-1.323L202.615.325a1 1 0 1 0-.826 1.822l7.286 3.304-3.304 7.286a1 1 0 0 0 1.821.826l3.718-8.197ZM.994 3.915l98.5 43.5.808-1.83-98.5-43.5-.808 1.83Zm99.256 43.521L210.751 5.889l-.704-1.872-110.5 41.547.703 1.872Z"
                />
              </svg>
              <div className="flex flex-col">
                <svg
                  className="h-16 md:h-28"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 130 143">
                  <g clipPath="url(#fold)">
                    <path
                      fill="#87AFFC"
                      d="M32.8 18.668c-.934 6.8-.667 7.333 7.866 22.133 4.933 8.267 9.333 15.467 10 15.867.533.4 3.2-3.067 5.867-7.467l4.8-8.133-6.534-7.467c-3.6-4.267-9.866-10.8-13.866-14.667l-7.2-7.2-.934 6.934ZM45.334 18l5.866 6h28.4l5.6-6 5.6-6H39.467l5.867 6ZM82.4 26.536 69.467 40.669l4.533 8c2.534 4.4 5.067 8.133 5.6 8.267.534.133 5.2-6.667 10.134-15.334C98 27.47 98.8 25.47 98 20.67c-.4-2.933-1.2-6-1.733-6.667-.533-.933-6.267 4.4-13.867 12.534Z"
                    />
                    <path
                      fill="#185ADB"
                      d="M3.6 28.935c-.534.4-.934 24.666-.934 53.733 0 39.333.4 53.2 1.6 54.4 1.2 1.2 9.2 1.6 27.6 1.6h26l-4.8-5.067c-7.867-8.266-7.867-7.733-3.6-36.933 2.133-14.667 4.133-28.267 4.4-30.267.667-3.066.267-3.6-2.8-4-3.067-.4-5.2-3.066-13.733-17.333l-10-16.933L15.866 28c-6.267 0-11.867.4-12.267.934ZM93.334 45.068c-8.934 15.2-10.4 16.933-13.6 16.933-2.934-.133-3.6.4-3.067 2.667.667 2.8 8.667 58.533 8.667 60 0 .4-2.8 3.733-6.134 7.333l-6.266 6.667h26.133c25.467 0 26.133-.133 28.133-2.933 1.867-2.534 2.134-9.867 2.134-52.8 0-31.734-.534-50.667-1.334-52.4-1.2-2.267-2.933-2.534-13.066-2.4h-11.6l-10 16.933Z"
                    />
                    <path
                      fill="#87AFFC"
                      d="M58.8 68.936c-.8 6.533-2.933 21.333-4.666 33.066l-3.2 21.334 5.2 6.133c8.533 10.267 8.666 10.267 14 5.067 10.666-10.134 10.266-7.467 5.2-42.667-2.534-17.2-4.667-32-4.667-32.933 0-.934-1.867-1.6-5.2-1.6H60.4l-1.6 11.6Z"
                    />
                  </g>
                  <clipPath id="fold">
                    <path fill="#fff" d="M0 0h129.333v142.667H0z"/>
                  </clipPath>
                </svg>
                <div className="home-step my-8">
                  <span>Step 4</span>
                </div>
                <div className="mx-auto max-w-[200px] text-center text-sm font-semibold md:text-lg">
                  You pick-up or we
                  <span className="text-primary">{" deliver "}</span> clean,
                  folded clothes
                </div>
              </div>
            </div>

            <h2 className="pb-8 pt-20 text-center text-xl font-semibold md:pb-16 md:text-3xl">
              Why Deluxe Cleaners ?
            </h2>
            <div className="flex flex-col gap-5 lg:flex-row">
              <div className="w-full rounded-3xl bg-[#DAFFE9] p-6 md:p-8">
                <RiShieldCheckFill size={64} className="text-primary"/>
                <div className="mt-6 text-xl font-semibold md:text-2xl">
                  Personalized Experience
                </div>
                <div className="mt-2 font-medium tracking-tight">
                  Our staff are well trained, our operation is efficient, and
                  our service are professional.
                </div>
              </div>
              <div className="w-full rounded-3xl bg-[#DAFFE9] p-6 md:p-8">
                <RiShieldUserFill size={64} color="#FFCA49"/>
                <div className="mt-6 text-xl font-semibold md:text-2xl">
                  Convenience
                </div>
                <div className="mt-2 font-medium tracking-tight">
                  {
                    "You can be sure that we'll give your laundry the ultimate treatment, cleaning them with quality products and machines for a thoroughly professional clean."
                  }
                </div>
              </div>
              <div className="w-full rounded-3xl bg-[#DAFFE9] p-6 md:p-8">
                <RiShieldStarFill size={64} color="#42CA50"/>

                <div className="mt-6 text-xl font-semibold md:text-2xl">
                  Quality Assurance
                </div>
                <div className="mt-2 font-medium tracking-tight">
                  We know your time is important, therefore we offer both
                  door-to-door delivery service and 8 convenient locations
                  across the triangle; thus assuring the highest levels of
                  convenience.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 bg-white">
          <div className="container">
            <h2 className="py-8 text-center text-xl font-semibold md:py-16 md:text-3xl">
              Subscription Plans
            </h2>
          </div>

          {isSubsPackagesLoading ? (
            <LoadingSpinner position={"center"}/>
          ) : (
            <div className="mx-auto flex items-center gap-8 overflow-auto px-8 pb-8 xl:justify-center">
              {subscriptionList.length > 0 &&
                subscriptionList.map((item, index) => (
                  <div
                    className="max-w-xs shrink-0 rounded-xl bg-[#F3F3F3] px-8"
                    key={index}>
                    <div className="mx-auto mb-6 w-10/12 rounded-b-3xl bg-[#FFD990] p-2 text-center font-semibold">
                      {item.tag}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-primary/[15%] py-1.5 px-2">
                        <svg
                          className="h-14 w-14"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 64 64">
                          <path
                            fill="#FF782C"
                            d="M12.768 12.469c-1.937.602-2.905 1.915-3.701 4.97-.258.947-1.764 8.391-3.378 16.525C3.45 45.216 2.784 48.982 2.892 49.627c.193 1.098 1.011 2.066 2 2.345.56.173 8.844.216 26.831.173l26.035-.065 1.011-.602c.56-.323 1.227-.883 1.485-1.248 1.033-1.442 1.076-1.076-2.389-18.375-2.044-10.177-3.378-16.438-3.679-17.02-.56-1.161-1.657-2.151-2.71-2.43-1.27-.366-37.568-.302-38.708.064Zm38.428 3.249c.43.473.903 2.517 3.7 16.287 2.432 12.071 3.12 15.88 2.97 16.267-.108.258-.452.58-.775.688-.344.13-7.316.215-18.59.215h-18.03l-.538-.624c-.345-.408-.689-1.334-1.012-2.754-.258-1.161-1.29-5.465-2.28-9.574-2.023-8.392-3.357-14.739-3.766-17.902l-.28-2.13.603-.495.581-.516h36.922l.495.538Z"
                          />
                          <path
                            fill="#fff"
                            d="M51.196 15.718c.43.473.903 2.517 3.7 16.287 2.432 12.071 3.12 15.88 2.97 16.267-.108.258-.452.58-.775.688-.344.13-7.316.215-18.59.215h-18.03l-.538-.624c-.345-.408-.689-1.334-1.012-2.754-.258-1.161-1.29-5.465-2.28-9.574-2.023-8.392-3.357-14.739-3.766-17.902l-.28-2.13.603-.495.581-.516h36.922l.495.538Z"
                          />
                          <path
                            fill="#FF782C"
                            d="M40.76 24.196c-.603.258-1.12.86-4.627 5.185-1.678 2.066-3.12 3.787-3.227 3.83-.108.043-.84-.56-1.657-1.312-1.958-1.83-2.388-2.088-3.356-2.088-1.593 0-2.733 1.162-2.733 2.733.022.452.13 1.011.28 1.27.236.387 3.442 3.42 5.53 5.206 1.032.904 2.216 1.098 3.248.603 1.055-.538 9.92-11.188 10.2-12.286.343-1.398-.883-3.012-2.475-3.227-.41-.065-.947-.022-1.184.086Z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{item.name}</div>
                        <div className="mt-0.5">
                          <span className="text-lg font-semibold">
                            ${item.month}
                          </span>
                          {" monthly"}
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 space-y-3">
                      <div className="flex items-center gap-2">
                        <RiStarFill size={18} className="text-primary"/>
                        <span className="font-medium">
                          {item.pickup} Laundry Pickups
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RiStarFill size={18} className="text-primary"/>
                        <span className="font-medium">
                          {item.delivery} Laundry Delivery
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push("/subscription")}
                      className="mx-auto mb-4 mt-10 block w-max rounded-full bg-[#FF782C] py-2.5 px-8 text-white">
                      Choose Plan
                    </button>
                  </div>
                ))}
              {membershipList && (
                <div
                  className="max-w-xs shrink-0 rounded-xl bg-[#F3F3F3] px-8"
                  key={membershipList.id}>
                  <div className="mx-auto mb-6 w-10/12 rounded-b-3xl bg-[#FFD990] p-2 text-center font-semibold">
                    {membershipList?.benefits &&
                      membershipList?.benefits?.split(",").slice(0, 1)}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-primary/[15%] py-1.5 px-2">
                      <svg
                        className="h-14 w-14"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 64 64">
                        <path
                          fill="#FF782C"
                          d="M12.768 12.469c-1.937.602-2.905 1.915-3.701 4.97-.258.947-1.764 8.391-3.378 16.525C3.45 45.216 2.784 48.982 2.892 49.627c.193 1.098 1.011 2.066 2 2.345.56.173 8.844.216 26.831.173l26.035-.065 1.011-.602c.56-.323 1.227-.883 1.485-1.248 1.033-1.442 1.076-1.076-2.389-18.375-2.044-10.177-3.378-16.438-3.679-17.02-.56-1.161-1.657-2.151-2.71-2.43-1.27-.366-37.568-.302-38.708.064Zm38.428 3.249c.43.473.903 2.517 3.7 16.287 2.432 12.071 3.12 15.88 2.97 16.267-.108.258-.452.58-.775.688-.344.13-7.316.215-18.59.215h-18.03l-.538-.624c-.345-.408-.689-1.334-1.012-2.754-.258-1.161-1.29-5.465-2.28-9.574-2.023-8.392-3.357-14.739-3.766-17.902l-.28-2.13.603-.495.581-.516h36.922l.495.538Z"
                        />
                        <path
                          fill="#fff"
                          d="M51.196 15.718c.43.473.903 2.517 3.7 16.287 2.432 12.071 3.12 15.88 2.97 16.267-.108.258-.452.58-.775.688-.344.13-7.316.215-18.59.215h-18.03l-.538-.624c-.345-.408-.689-1.334-1.012-2.754-.258-1.161-1.29-5.465-2.28-9.574-2.023-8.392-3.357-14.739-3.766-17.902l-.28-2.13.603-.495.581-.516h36.922l.495.538Z"
                        />
                        <path
                          fill="#FF782C"
                          d="M40.76 24.196c-.603.258-1.12.86-4.627 5.185-1.678 2.066-3.12 3.787-3.227 3.83-.108.043-.84-.56-1.657-1.312-1.958-1.83-2.388-2.088-3.356-2.088-1.593 0-2.733 1.162-2.733 2.733.022.452.13 1.011.28 1.27.236.387 3.442 3.42 5.53 5.206 1.032.904 2.216 1.098 3.248.603 1.055-.538 9.92-11.188 10.2-12.286.343-1.398-.883-3.012-2.475-3.227-.41-.065-.947-.022-1.184.086Z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {membershipList.name}
                      </div>
                      <div className="mt-0.5">
                        <span className="text-lg font-semibold">
                          ${membershipList.month}
                        </span>
                        {" monthly"}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 space-y-3">
                    {membershipBenefits &&
                      membershipBenefits.map((item, index) => {
                        return (
                          <>
                            <div className="flex items-center gap-2">
                              <RiStarFill size={18} className="text-primary"/>
                              <span className="font-medium">{item}</span>
                            </div>
                          </>
                        );
                      })}
                  </div>
                  <button
                    onClick={() => router.push("/subscription")}
                    className="mx-auto mb-4 mt-10 block w-max rounded-full bg-[#FF782C] py-2.5 px-8 text-white">
                    Choose Plan
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mt-8 bg-white">
          <div className="container py-8 md:pt-16">
            <h2 className="text-center text-xl font-semibold md:text-3xl">
              THE BEST GUARANTEE IN THE BUSINESS
            </h2>
            <div className="mx-auto my-6 h-2 w-32 rounded-full bg-primary md:h-1"/>
            <p className="mx-auto mt-4 max-w-7xl text-center text-lg font-medium">
              We'll do everything we can to return your clothes in
              great shape. In the rare instance that an item goes missing or is
              damaged during the cleaning process, we’ll reimburse you ten times
              the amount it cost you to get the garment clean.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 md:gap-8 lg:flex-row">
              <div className="rounded-xl bg-[#F3F3F3] p-8">
                <div className="flex gap-4">
                  <RiDoubleQuotesL
                    size={32}
                    className="shrink-0 text-primary"
                  />
                  <div>
                    <div className="text-xl font-bold md:text-2xl">Susan</div>
                    <div className="font-semibold text-primary">Customer</div>
                    <div className="mt-2">
                      I've been using SparkleUp is powered by Deluxe Cleaners for a few months now and I
                      couldn't be happier. The quality of their services is
                      top-notch and my clothes always come back looking and
                      smelling great. They are also very prompt with their
                      pick-up and delivery services. Highly recommend!
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-[#F3F3F3] p-8">
                <div className="flex gap-4">
                  <RiDoubleQuotesL
                    size={32}
                    className="shrink-0 text-primary"
                  />
                  <div>
                    <div className="text-xl font-bold md:text-2xl">Michael</div>
                    <div className="font-semibold text-primary">Customer</div>
                    <div className="mt-2">
                      I recently tried SparkleUp is powered by Deluxe Cleaners for the first time and I
                      was very impressed. They have a wide range of services and
                      their prices are very reasonable. Their customer service
                      is also excellent, always willing to help and answer any
                      questions I have. I highly recommend them!
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-[#F3F3F3] p-8">
                <div className="flex gap-4">
                  <RiDoubleQuotesL
                    size={32}
                    className="shrink-0 text-primary"
                  />
                  <div>
                    <div className="text-xl font-bold md:text-2xl">Steve</div>
                    <div className="font-semibold text-primary">Customer</div>
                    <div className="mt-2">
                      SparkleUp is powered by Deluxe Cleaners is the best laundry service I have ever
                      used. Their customer service is excellent, they are very
                      professional and friendly. They always follow my
                      instructions and my clothes come back looking great.
                      Highly recommend!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative mt-8 hidden overflow-hidden bg-white md:block">
          <div className="container flex">
            <div className="flex w-1/2 flex-col justify-center px-4">
              <div className="max-w-lg text-3xl font-bold">
                Transform your laundry experience, download our app
              </div>
              <div className="mt-2 text-lg">
                Please enter your phone number to get the App download link
              </div>
              {(phoneNumber.error || phoneNumber.success) && (
                <div
                  className={`mt-3 text-xl font-semibold ${
                    phoneNumber.success ? "text-green-500" : "text-red-500"
                  }`}>
                  {phoneNumber.errorMessage}
                </div>
              )}
              <div className="mt-6 flex max-w-md rounded-lg border-2 border-primary">
                <div className="border-r-2 border-primary px-6 py-3 text-xl font-semibold">
                  +1
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full bg-transparent px-4 outline-none"
                  onChange={onPhoneNumberChange}
                  value={phoneNumber.value}
                  placeholder="Enter Phone Number"
                  maxLength={10}
                />
                <button
                  disabled={isLinkBeingSent}
                  // rounded-l-full
                  className=" bg-primary py-3 pl-10 pr-8 text-lg text-white"
                  onClick={onSendAppLinkButtonClick}>
                  {isLinkBeingSent ? "Sending..." : "Send"}
                </button>
              </div>
              {appLink && (
                <>
                  <div className="mt-8 flex gap-4">
                    {/* <Link href={{ pathname: appLink?.[0]?.apkLink }} > */}
                    <Link
                      href={{
                        pathname: appLink.find(
                          (item) => item.deviceType == "Android"
                        ).apkLink
                      }}>
                      <div className="flex cursor-pointer items-center rounded-xl bg-black py-2 px-3">
                        <img
                          src="/images/google-play.png"
                          className="h-8 w-8 object-contain"
                          alt=""
                        />
                        <div className="ml-3 w-32 text-white">
                          <div className="text-sm font-medium">GET IT ON</div>
                          <div className="text-lg font-bold leading-5">
                            Google Play
                          </div>
                        </div>
                      </div>
                    </Link>

                    <Link
                      href={{
                        pathname: appLink.find(
                          (item) => item.deviceType == "Ios"
                        ).apkLink
                      }}>
                      <div className="flex cursor-pointer items-center rounded-xl bg-black py-2 px-3">
                        <img
                          src="/images/app-store.png"
                          className="h-8 w-8 object-contain"
                          alt=""
                        />
                        <div className="ml-3 w-32 text-white">
                          <div className="text-sm font-medium">
                            Download on the
                          </div>
                          <div className="text-lg font-bold leading-5">
                            App Store
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </>
              )}
            </div>
            <div className="relative z-[1] h-[40rem] w-1/2">
              <img
                className="absolute left-20 bottom-0 w-80"
                src="/images/sc1.png"
                alt=""
              />
              <img
                className="absolute left-72 bottom-0 w-80"
                src="/images/sc2.png"
                alt=""
              />
            </div>
          </div>
          {/* bg-yellow-200 */}
          <div className="absolute left-1/2 bottom-0 top-4 z-0 w-full rounded-tl-[10rem] "/>
        </div>
      </main>
      <Footer/>
    </>
  );
};
Home.authGuard = false;
// Home.guestGuard = true
export default Home;
