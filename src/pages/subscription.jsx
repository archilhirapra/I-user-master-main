import React, { useState, useEffect } from "react";
import HeaderHome from "../components/HeaderHome";
import {
  RiStarFill,
  RiVipCrownFill
} from "react-icons/ri";
import Accordion from "../components/account/Accordion";
import ModalResponsive from "../components/ModalResponsive";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Footer from "../components/Footer";
import axios from "axios";
import subscriptionConfig from "src/configs/subscriptionConfig";

import authConfig from "src/configs/auth";
import Image from "next/image";
import { useCallback } from "react";
import LoadingSpinner from "src/components/LoadingSpinner";
import { useMemo } from "react";
import { LoadingButton } from "src/components/LoadingButton";
import AlertDialog from "src/components/AlertDialog";
import { useRouter } from "next/router";
import CreditCardInput from "react-credit-card-input";

//seo
import { PlanSeo } from "../seo/seo";
import Input from "../components/Input";

const subscriptionListInitials = {
  name: "",
  icon: "",
  pickup: 1,
  delivery: 1,
  month: 1,
  year: 1,
  isVisible: true,
  tag: "",
  createdAt: "",
  updatedAt: "",
  quarterly: 1,
  id: "e"
};

const Plan = ({ isSelected, isRecommended, onClick, planCost, planDuration }) => {

  return (

    <div
      className={`relative flex cursor-pointer items-center overflow-hidden rounded-xl border-2 text-body ${isSelected ? "border-primary" : "border-transparent"
      } bg-[#F9F9F9] p-5`}
      onClick={onClick}
    >
      <div
        className={`h-6 w-6 shrink-0 rounded-full border-4 border-gray-200 ${isSelected ? "bg-green-600" : "bg-gray-300"
        }`}
      />
      <div className="px-5">
        <p className="font-medium">{planDuration}</p>
        <p className="text-xs">Pay {planDuration}</p>
      </div>
      <div className="px-5">
        <strike>${Number(planCost + 10).toFixed(2)}</strike>
        <p className="font-medium">
          ${planCost.toFixed(2)} <span className="text-sm">{planDuration}</span>
        </p>
      </div>
      {isRecommended && (
        <div
          className="absolute right-3 top-3 flex h-full w-10 origin-center -translate-y-1/2 translate-x-1/2 -rotate-45 items-center justify-center bg-primary pr-2 text-white">
          <RiStarFill size={20} className="rotate-45"/>
        </div>
      )}
    </div>
  );
};

function Subscription() {

  const [openAlert, setOpenAlert] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("confirm");
  const [msg, setMsg] = useState("");

  const initialState = {
    card_number: "",
    card_expiry: "",
    card_cvv: ""
  };
  const [open, setOpen] = useState(false);
  const [addCard, setAddCard] = useState(false);
  const [isSubsPackagesLoading, setIsSubsPackagesLoading] = useState(false);
  const [isTOSAgreed, setIsTOSAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [membershipDetails, setMembershipDetails] = useState([]);
  const [cardDetail, setCardDetail] = useState([]);
  const [clickedPlan, setClickedPlan] = useState({});
  const [choosenPackage, setChoosenPackage] = useState({});
  const [isAddonSelected, setIsAddonSelected] = useState(false);
  const [isMembership, setIsMembership] = useState(false);
  const [addCardData, setAddCardData] = useState(initialState);
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState(false);
  const [selectCard, setSelectCard] = useState("");
  const [subscriptionDetail, setPlanSubscriptionDetail] = useState([]);
  const [subscriptionMembershipDetail, setMembershipSubscriptionDetail] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [subscriptionList, setSubscriptionList] = useState([subscriptionListInitials]);
  const router = useRouter();
  useEffect(() => {
    if (window.localStorage.getItem("accessToken")) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    fetchAllSubscriptions();
    fetchMembershipDetails();
    isLoggedIn && getPlanSubsriptionDetail();
    isLoggedIn && getMembershipSubsriptionDetail();
  }, []);

  useEffect(() => {
    isLoggedIn && open && fetchUserCardDetail();
  }, [open]);

  const fetchUserCardDetail = async () => {
    const response = await axios.get(subscriptionConfig.getCardDetails, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem(authConfig.storageTokenKeyName)
      }
    });
    setCardDetail(response.data.data.data);
    if (response.data.data.data.length) {
      const data = [...response.data.data.data];
      setCardDetail(data.map((item) => ({ card_number: item.card, id: item.id })));
    }
  };

  const fetchAllSubscriptions = async () => {
    setIsSubsPackagesLoading(true);
    const response = await axios.get(subscriptionConfig.getSubscriptionList);
    // setSubscriptionList(response.data.data.data.slice(0, 3));
    setSubscriptionList(response.data.data.data);
    setIsSubsPackagesLoading(false);
  };

  const onIncludeAddOnChange = () => {
    setIsAddonSelected(prev => !prev);
  };

  const [membershipBenefits, setMembershipBenefits] = useState([]);

  const fetchMembershipDetails = async () => {
    const response = await axios.get(subscriptionConfig.getMembershipDetails,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem(authConfig.storageTokenKeyName)
        }
      });
    setMembershipBenefits(response?.data?.data?.data?.benefits.split(",").slice(1));
    setMembershipDetails(response.data.data.data);
  };


  const getPlanSubsriptionDetail = async () => {

    const response = await axios.get(subscriptionConfig.getSubscriptionDetails,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem(authConfig.storageTokenKeyName)
        }
      });
    setPlanSubscriptionDetail(response.data.data.data);
  };

  const getMembershipSubsriptionDetail = async () => {

    const response = await axios.get(subscriptionConfig.getMembershipDetailsOfUser,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem(authConfig.storageTokenKeyName)
        }
      });
    setMembershipSubscriptionDetail(response.data.data.data);
  };

  const getFinalPrice = useCallback(() => {

    if (isAddonSelected) {
      return choosenPackage === clickedPlan.month ? `$${(choosenPackage + membershipDetails.month).toFixed(2)}/Month` : `$${(choosenPackage + membershipDetails.year).toFixed(2)}/Year`;
    }
    // return '$' + choosenPackage.toFixed(2);
    return choosenPackage === 0 ? `$${(clickedPlan.month).toFixed(2)}/Month` : (choosenPackage === 1 ? `$${(clickedPlan.quarterly).toFixed(2)}/3 Month` : `$${(clickedPlan.year).toFixed(2)}/Year`);

  }, [choosenPackage, isAddonSelected, clickedPlan, membershipDetails]);


  const purchasePlan = () => {
    setIsSubmitting(true);

    let link = "";
    const cardIsIncluded = cardDetail.find((item) => item?.id === selectCard);
    let params = {
      planId: clickedPlan?.id, duration: 0, isAuto: true
    };

    let memberShipParams = {
      "detailId": "63cf60fc3e3ba3f9dc80242d",
      "duration": 0,
      "isAuto": true
    };
    if (cardIsIncluded) {
      params.paymentMethodIdPassed = selectCard;
      memberShipParams.paymentMethodIdPassed = selectCard;
    } else {
      const lastObject = cardDetail[cardDetail?.length - 1];
      params.card_number = lastObject?.card_number;
      params.card_expiry = lastObject?.card_expiry;
      params.card_cvv = lastObject?.card_cvv;
      memberShipParams.card_number = lastObject?.card_number;
      memberShipParams.card_expiry = lastObject?.card_expiry;
      memberShipParams.card_cvv = lastObject?.card_cvv;
    }
    if (isMembership) {
      link = subscriptionConfig.purchaseMembership;
    } else {
      link = subscriptionConfig.purchaseSubscrition;
    }


    const headers = {
      Accept: "application/json",
      // 'Content-Type': 'application/json',
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + window.localStorage.getItem(authConfig.storageTokenKeyName)
    };

    const storedToken =
      "Bearer " + window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      axios.post(link, (isMembership ? memberShipParams : params), {
        headers: {
          Authorization: storedToken
        }
      })
        .then(async (res) => {
          if (res?.data?.data?.data?.link) {
            router.push(res?.data?.data?.data?.link);
          }
          setOpenAlert(true);
          setType("success");
          setTitle(`Purchase ${isMembership ? "Membership" : "Plan"}`);
          setMsg(res?.data?.message);
          setError("");
          setSelectCard("");
          setAddCard(false);
          setAddCardData({});
          setCardDetail([]);
          setOpen(false);
          setIsMembership(false);
          setClickedPlan({});
          setChoosenPackage({});
        })
        .catch(async e => {
          setOpenAlert(true);
          setType("error");
          setTitle("Error");
          setMsg(e?.response?.data?.message);
          setError("");
          setSelectCard("");
          setAddCard(false);
          setAddCardData({});
          setCardDetail([]);
          setOpen(false);
          setIsMembership(false);
          setClickedPlan({});
          setChoosenPackage({});
        });
    } catch (e) {
      setOpenAlert(true);
      setType("error");
      setTitle("Error");
      setError("");
      setSelectCard("");
      setAddCard(false);
      setAddCardData({});
      setCardDetail([]);
      setMsg(e?.response?.data);
      setOpen(false);
      setIsMembership(false);
      setClickedPlan({});
      setChoosenPackage({});
    }


    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };


  const closeDialog = () => {
    if (type == "success") {
      // reset()
    }
    setOpenAlert(false);
  };

  const HandleAddCard = () => {
    if (addCardData?.card_expiry && addCardData?.card_number && addCardData?.card_cvv) {
      setCardDetail([...cardDetail, addCardData]);
      setAddCardData({ ...initialState });
      setShowInput(false);
    } else {
      setShowInput(true);
    }
  };

  const CancelPlan = (type, data) => {
    let link = "";
    if (type === "membership") {
      link = subscriptionConfig.cancelMemberShip;
    } else if (type === "plan") {
      link = subscriptionConfig.cancelMemberShip;
    }
    const params = {
      "subscriptionId": data.id
    };
    const storedToken =
      "Bearer " + window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      axios.post(link, (params), {
        headers: {
          Authorization: storedToken
        }
      })
        .then(async (res) => {
          setOpenAlert(true);
          setType("success");
          setTitle("Plan Cancel");
          setMsg(res.data.message);
          if (type === "membership") {
            getMembershipSubsriptionDetail();
          } else if (type === "plan") {
            getPlanSubsriptionDetail();
          }
        })
        .catch(async e => {
          setOpenAlert(true);
          setType("error");
          setTitle("Error");
          setMsg(e?.response?.data?.message);
        });
    } catch (e) {
      setOpenAlert(true);
      setType("error");
      setTitle("Error");
      setMsg(e?.response?.data);
    }
  };

  const HandleSelectCard = (item, index) => {
    setSelectCard("");
    if (item.id) {
      setSelectCard(item.id);
    } else {
      setSelectCard(index);
    }
  };

  return (
    <>
      <PlanSeo/>
      <AlertDialog
        isOpen={openAlert}
        onClose={closeDialog}
        type={type}
        title={title}
        content={msg}
      />
      {
        open &&
        <ModalResponsive isOpen={open} onClose={() => {
          setIsTOSAgreed(false);
          setOpen(false);
          setAddCard(false);
          setShowInput(false);
          setAddCardData(initialState);
          setIsMembership(false);
          setClickedPlan({});
          setError("");
          setSelectCard("");
          setAddCard(false);
          setAddCardData({});
          setCardDetail([]);
          setChoosenPackage({});
        }}>
          <div className="flex h-full max-h-[80vh] flex-col">
            <div className="flex items-center justify-between border-b p-4">
              <span className="font-medium">Plan Details</span>
              <div className="flex item-center gap-1">
                {addCard && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 40 30"
                                 onClick={() => setAddCard(false)} strokeWidth={1.5}
                                 stroke="currentColor" className="w-6 h-6 text-gray-400 cursor-pointer">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/>
                </svg>}
                <button
                  onClick={() => {
                    setIsTOSAgreed(false);
                    setOpen(false);
                    setAddCard(false);
                    setShowInput(false);
                    setAddCardData(initialState);
                  }}
                  className="text-gray-400 hover:text-gray-900"
                >
                  <XMarkIcon className="h-6 w-6 md:h-5 md:w-5"/>
                </button>
              </div>
            </div>
            {addCard ?
              <>
                <div className="overflow-auto p-5">
                  <div className="space-y-4">
                    {cardDetail?.length > 0 && cardDetail.map((item, index) =>
                      <div key={index}
                           onClick={() => HandleSelectCard(item, index)}
                           className={`relative flex cursor-pointer gap-2 items-center overflow-hidden rounded-xl border-2 text-body ${selectCard === (item?.id || index) ? "border-primary" : "border-transparent"
                           } bg-[#F9F9F9] p-5`}
                      >
                        <div
                          className={`h-6 w-6 shrink-0 rounded-full border-4 border-gray-200 ${selectCard === (item?.id || index) ? "bg-green-600" : "bg-gray-300"
                          }`}
                        />
                        <div
                          className="rounded-lg bg-sky-400 w-full p-2	h-full">
                          <div className="h-16 pl-2 pt-2">
                            <img src="/images/chip.png" height={30} width={50}/>
                          </div>
                          <div className="flex mt-10 mr-5 text-lg font-semibold   justify-end">
                            {item?.card_number}
                          </div>
                          <div className="flex justify-end mt-3 mr-5 text-lg font-semibold">
                            <p>Exp: {item?.card_expiry}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {showInput && <div className="flex items-center gap-2">
                      <CreditCardInput
                        cardNumberInputProps={{
                          value: addCardData.card_number, onChange: (e) => {
                            setAddCardData({ ...addCardData, card_number: e?.target?.value });
                            setError("");
                          }
                        }}
                        cardExpiryInputProps={{
                          value: addCardData.card_expiry, onChange: (e) => {
                            setAddCardData({ ...addCardData, card_expiry: e?.target?.value });
                            setError("");
                          }
                        }}
                        cardCVCInputProps={{
                          value: addCardData.card_cvv, onChange: (e) => {
                            setAddCardData({ ...addCardData, card_cvv: e?.target?.value });
                            setError("");
                          }
                        }}
                        fieldClassName="input"
                        onError={(e) => setError(e?.error)}
                      />
                      <TrashIcon className="h-7 cursor-pointer w-7" onClick={() => {
                        setShowInput(false);
                        setAddCardData({});
                        setError("");
                      }}/>
                    </div>}
                  </div>
                  <button disabled={error} className="mx-auto mb-4 mt-10 block w-max btn-primary"
                          onClick={() => HandleAddCard()}>
                    + Add new Card
                  </button>
                </div>
              </>
              :
              <div className="overflow-auto p-5">
                <div className="space-y-4">
                  <Plan planCost={clickedPlan.year} planDuration={"Yearly"} isRecommended
                        isSelected={choosenPackage === 2} onClick={() => setChoosenPackage(2)}/>
                  <Plan planCost={clickedPlan.quarterly} planDuration={"Quarterly"} isSelected={choosenPackage === 1}
                        onClick={() => setChoosenPackage(1)}/>
                  <Plan planCost={clickedPlan.month} planDuration={"Monthly"} isSelected={choosenPackage === 0}
                        onClick={() => setChoosenPackage(0)}/>
                  {/* <Plan planCost={clickedPlan.year} planDuration={'Yearly'} isRecommended isSelected={choosenPackage === clickedPlan.year} onClick={() => setChoosenPackage(() => clickedPlan.year)} />
                <Plan planCost={clickedPlan.quarterly} planDuration={'Quarterly'} isSelected={choosenPackage === clickedPlan.quarterly} onClick={() => setChoosenPackage(() => clickedPlan.quarterly)} />
                <Plan planCost={clickedPlan.month} planDuration={'Monthly'} isSelected={choosenPackage === clickedPlan.month} onClick={() => setChoosenPackage(() => clickedPlan.month)} /> */}
                </div>

                {/* <div className="mt-8 flex items-center gap-3 text-lg font-medium">
                <label htmlFor="includeAddon" >Include addon?</label>
                <input onChange={() => setIsAddonSelected(prev => !prev)} type="checkbox" id="includeAddon" defaultChecked={false} checked={isAddonSelected} className="h-4 w-4" />
              </div> */}

                {isMembership && (
                  <div className="relative mt-12 rounded-xl bg-gray-100 p-6 pt-12">
                    <div
                      className="absolute top-0 left-8 flex w-max -translate-y-1/2 items-center rounded-full border border-gray-200 bg-white py-2 px-3 font-semibold text-[#FFB400]">
                      <RiVipCrownFill className="h-6 w-6 text-[#FFB400]"/>
                      <span className="px-2">VIP</span>
                    </div>
                    <p className="text-lg font-semibold">DELUXE Membership Addon</p>
                    <p className="mt-2 text-primary">Benefits</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <RiStarFill size={18} className="text-primary"/>
                        <span className="font-medium">Same day Pickup</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RiStarFill size={18} className="text-primary"/>
                        <span className="font-medium">Same day Delivery</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RiStarFill size={18} className="text-primary"/>
                        <span className="font-medium">
                          Dedicated Customer Support
                        </span>
                      </div>
                    </div>
                    <p className="my-6 text-sm">
                      the order will be delivered the same day only if the order is
                      placed before 12 pm
                    </p>


                    {/* <div className="space-y-2">
                <div className="space-y-1 rounded-lg bg-white p-4 font-medium">
                  <p className="font-semibold">Your Current Plan</p>
                  <p>{clickedPlan.name}</p>
                  <p className="text-sm">{clickedPlan.year === choosenPackage ? `$${choosenPackage.toFixed(2)}/Year` : `$${choosenPackage.toFixed(2)}/Month`}</p>
                </div>
                {
                  isAddonSelected && <>
                    <div className="mx-auto h-8 w-8 rounded-lg bg-white text-center text-lg font-medium leading-8">
                      +
                    </div>
                    <div className="space-y-1 rounded-lg bg-white p-4 font-medium">
                      <p className="font-semibold">{membershipDetails.name}</p>
                      <p className="text-sm">{choosenPackage === clickedPlan.year ? `$${membershipDetails.year.toFixed(2)}/Year` : `$${membershipDetails.month.toFixed(2)}/Month`}</p>
                    </div>
                    <div className="mx-auto h-8 w-8 rounded-lg bg-white text-center text-lg font-medium leading-8">
                      =
                    </div>
                    <div className="space-y-1 rounded-lg bg-white p-4 font-medium">
                      <p className="font-semibold">Final Price</p>
                      <p className="text-sm">{getFinalPrice()}</p>
                    </div>
                  </>
                }
              </div> */}
                  </div>
                )}


              </div>}
            <div className="border-t p-5">
              <div className="font-medium">Total Amount: {getFinalPrice()}</div>
              <div className="mb-4 mt-2 flex items-center gap-2">
                <input checked={isTOSAgreed} onChange={() => setIsTOSAgreed(prev => !prev)} type="checkbox" id="tnc"
                       className="h-4 w-4" defaultChecked={false}/>
                <label htmlFor="tnc">
                  I agree to the
                  <a href="#" className="px-1 text-primary hover:underline">
                    terms and conditions.
                  </a>
                </label>
              </div>
              {
                isSubmitting ?
                  <LoadingButton widthClassName="w-full"/>
                  :
                  <button disabled={!isTOSAgreed || addCard ? selectCard === '' : false} className="btn-primary"
                          onClick={() => {
                            addCard ? purchasePlan() : setAddCard(true);
                          }}>
                    {/*<button disabled={!isTOSAgreed} className="btn-primary" onClick={() => purchasePlan()}>*/}
                    {!addCard ? "Select Card" : "Make Payment"}
                  </button>
              }
            </div>
          </div>
        </ModalResponsive>
      }
      <HeaderHome/>
      <div className="mx-auto mt-8 max-w-6xl bg-white px-4">
        <div className="space-y-4 py-8">
          <h2 className="text-xl font-bold md:text-3xl">Subscription Plans</h2>
          <p>
            {
              "Find the perfect balance of cost and convenience with our subscription plans."
            }
          </p>
        </div>
        {subscriptionMembershipDetail?.length ?
          <div className="mt-8 mb-6 bg-[#FFD990] rounded-2xl">
            <div className="container">
              <h2 className="text-center text-xl font-semibold md:py-16 md:text-3xl">
                Subscription Membership
              </h2>
              {subscriptionMembershipDetail[0].isCancelled === false && <div className="pb-4">
                <button
                  onClick={() => CancelPlan("membership", subscriptionMembershipDetail[0])}
                  className="mx-auto mb-4 block w-max rounded-full bg-[#FF782C] py-2.5 px-8 text-white">
                  Cancel Membership
                </button>
              </div>}
            </div>
          </div>
          :
          <></>
        }
        {
          isSubsPackagesLoading ?
            <LoadingSpinner position={"center"}/> :
            <div className="flex gap-8 overflow-auto pb-8">
              {
                subscriptionList.length > 0 &&
                subscriptionList.map((item, index) => (
                  <div className="max-w-xs shrink-0 rounded-xl bg-[#F3F3F3] px-8" key={index}>
                    <div
                      className="mx-auto w-10/12 rounded-b-3xl bg-[#FFD990] mb-6 p-2 text-center font-semibold">
                      {item.tag}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-primary/[15%] py-1.5 px-2">
                        <svg
                          className="h-14 w-14"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 64 64"
                        >
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
                          <span className="text-lg font-semibold">${item.month}</span>
                          {" monthly"}
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 space-y-3">
                      <div className="flex items-center gap-2">
                        <RiStarFill size={18} className="text-primary"/>
                        <span className="font-medium">{item.pickup} Laundry Pickups</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RiStarFill size={18} className="text-primary"/>
                        <span className="font-medium">{item.delivery} Laundry Delivery</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setOpen(true);
                        setIsMembership(false);
                        setClickedPlan(item);
                        setChoosenPackage(2);
                      }}
                      className="mx-auto mb-4 mt-10 block w-max rounded-full bg-[#FF782C] py-2.5 px-8 text-white"
                    >
                      Choose Plan
                    </button>
                  </div>
                ))
              }
              {
                membershipDetails && (
                  <div className="max-w-xs shrink-0 rounded-xl bg-[#F3F3F3] px-8" key={membershipDetails.id}>
                    <div className="mx-auto w-10/12 rounded-b-3xl bg-[#FFD990] mb-6 p-2 text-center font-semibold">
                      {membershipDetails?.benefits && (
                        membershipDetails?.benefits?.split(",").slice(0, 1)
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-primary/[15%] py-1.5 px-2">
                        <svg
                          className="h-14 w-14"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 64 64"
                        >
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
                        <div className="text-2xl font-bold">{membershipDetails?.name}</div>
                        <div className="mt-0.5">
                          <span className="text-lg font-semibold">${membershipDetails?.month}</span>
                          {" monthly"}
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 space-y-3">
                      {membershipBenefits && (
                        membershipBenefits.map((item, index) => {
                          return (
                            <>
                              <div className="flex items-center gap-2">
                                <RiStarFill size={18} className="text-primary"/>
                                <span className="font-medium">{item}</span>
                              </div>
                            </>
                          );
                        })
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setOpen(true);
                        setIsMembership(true);
                        setClickedPlan(membershipDetails);
                        setChoosenPackage(2);
                      }}
                      className="mx-auto mb-4 mt-10 block w-max rounded-full bg-[#FF782C] py-2.5 px-8 text-white"
                    >
                      Choose Plan
                    </button>
                  </div>
                )
              }
            </div>
        }
        {subscriptionDetail?.length ? <div className="mt-8 bg-[#FFD990] rounded-2xl">
          <div className="container">
            <h2 className="text-center text-xl font-semibold md:py-16 md:text-3xl">
              Subscription Plans
            </h2>
            <h5 className="text-center text-lg font-semibold">Your Current Plan</h5>
            <h6 className="text-center text-md font-semibold">{subscriptionList[0]?.name}</h6>
            <div className="pb-4">
              {subscriptionList[0]?.isCancelled === false &&
                <>
                  <button
                    onClick={() => CancelPlan("plan", subscriptionDetail[0])}
                    className="mx-auto mb-4 block w-max rounded-full bg-[#FF782C] py-2.5 px-8 text-white">
                    Cancel Plan
                  </button>
                </>
              }
            </div>
          </div>
        </div> : <></>}
        {/* <div className="py-4">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad,
          exercitationem, nihil. Ab blanditiis fugiat iure molestias officiis
          pariatur recusandae temporibus.
        </div> */}
        <div className="my-8 py-8">
          <h2 className="text-xl font-bold md:text-3xl">
            Frequently asked questions
          </h2>
          <div className="mt-4 divide-y rounded-md border border-gray-200 text-base md:mt-8">
            <Accordion
              classNames="text-lg"
              title="Can I cancel/upgrade/downgrade my subscription?"
            >
              <p className="border-t bg-gray-50 p-4 text-base">
                Yes, you can cancel, upgrade, or downgrade your subscription at any time in the app's settings.
                Simply
                log in to your account and navigate to the subscription tab to make any changes. If you have any
                issues,
                please contact our customer service team for assistance at (919) 438-0450 or
                contact@deluxecleanersnc.com
              </p>
            </Accordion>
            <Accordion
              classNames="text-lg"
              title="What if I am unsatisfied with the results?"
            >
              <p className="border-t bg-gray-50 p-4 text-base">
                We take customer satisfaction very seriously and want to ensure that you are completely happy with
                our
                service. If you are not satisfied with the results of your cleaning, please contact our customer
                service
                team as soon as possible. We will work to resolve the issue and make it right. Whether that's by
                re-cleaning the item(s) or offering a refund or credit.
              </p>
            </Accordion>
            <Accordion
              classNames="text-lg"
              title="What payment methods do you support?"
            >
              <p className="border-t bg-gray-50 p-4 text-base">
                Our app currently supports various payment methods, such as credit/debit cards, bank transfers,
                and
                digital wallets like Apple pay and Google pay. We also accepts Discover and American Express. If
                you
                have any issues with the payment, please contact our customer service team for assistance.
              </p>
            </Accordion>
            {/* <Accordion
              classNames="text-lg"
              title="Can I cancel/upgrade/downgrade my subscription?"
            >
              <p className="border-t bg-gray-50 p-4 text-base">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius
                eveniet laudantium omnis repellendus tenetur voluptatibus. Amet
                cupiditate facere porro quaerat?
              </p>
            </Accordion>
            <Accordion
              classNames="text-lg"
              title="What if I am unsatisfied with the results?"
            >
              <p className="border-t bg-gray-50 p-4 text-base">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius
                eveniet laudantium omnis repellendus tenetur voluptatibus. Amet
                cupiditate facere porro quaerat?
              </p>
            </Accordion>
            <Accordion
              classNames="text-lg"
              title="What payment methods do you support?"
            >
              <p className="border-t bg-gray-50 p-4 text-base">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius
                eveniet laudantium omnis repellendus tenetur voluptatibus. Amet
                cupiditate facere porro quaerat?
              </p>
            </Accordion>
            <Accordion
              classNames="text-lg"
              title="Can I cancel/upgrade/downgrade my subscription?"
            >
              <p className="border-t bg-gray-50 p-4 text-base">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius
                eveniet laudantium omnis repellendus tenetur voluptatibus. Amet
                cupiditate facere porro quaerat?
              </p>
            </Accordion>
            <Accordion
              classNames="text-lg"
              title="What if I am unsatisfied with the results?"
            >
              <p className="border-t bg-gray-50 p-4 text-base">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius
                eveniet laudantium omnis repellendus tenetur voluptatibus. Amet
                cupiditate facere porro quaerat?
              </p>
            </Accordion>
            <Accordion
              classNames="text-lg"
              title="What payment methods do you support?"
            >
              <p className="border-t bg-gray-50 p-4 text-base">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius
                eveniet laudantium omnis repellendus tenetur voluptatibus. Amet
                cupiditate facere porro quaerat?
              </p>
            </Accordion> */}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default Subscription;
