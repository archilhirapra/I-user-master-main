import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Image from "next/future/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  RiCalendarFill,
  RiInformationFill,
  RiMapPin2Fill,
  RiPercentFill,
} from "react-icons/ri";
import CouponCard from "src/components/Coupon";
import { LoadingButton } from "src/components/LoadingButton";
import LoadingSpinner from "src/components/LoadingSpinner";
import LoadingSpinnerItemOrange from "src/components/LoadingSpinnerItemOrange";
import TimeSlotPicker from "src/components/TimeSlotPicker";
import authConfig from "src/configs/auth";
import servicesConfig from "src/configs/servicesConfig";
import { useServicesContext } from "src/context/ServicesContext";
import { getInitialsFromDate } from "src/helper/formatDate";
import Accordion from "../../components/account/Accordion";
import AlertDialog from "../../components/AlertDialog";
import ChooseLocation from "../../components/ChooseLocation";
import HeaderHome from "../../components/HeaderHome";
import Modal from "../../components/Modal";
//seo
import { ServiceSeo } from "../../seo/seo";
function ServiceAddCard({
  itemData,
  itemAllData,
  saveInformationError,
  setSaveInformationError,
}) {
  // console.log(itemData)
  const { itemsInCart, savedUserInfo, onItemAddorRemoveToCart } =
    useServicesContext();

  const categoryNameRightSide = itemAllData?.categoryName?.name;

  const allProductsInCategory = itemsInCart.filter((item) =>
    item.includes(itemData.categoryName || categoryNameRightSide)
  );

  const cartItemData =
    (!!allProductsInCategory[0] &&
      !!allProductsInCategory[0][1] &&
      allProductsInCategory[0][1][0].filter(
        (item) => item.itemId === itemData.id
      )[0]) ||
    null;
  // const cartItemData = allProductsInCategory && allProductsInCategory[0][1][0].filter(item => item.itemId === currentItem.id)

  const [isItemBeingAdded, setIsItemBeingAdded] = useState(false);

  const add = async () => {
    setIsItemBeingAdded(true);
    await onItemAddorRemoveToCart(itemData, savedUserInfo.lastOrderId, "add");
    // .then((e) => {
    //   setSaveInformationError({
    //     hasError: true,
    //     message: "Please select all fields"
    //   })
    //   // setIsSubmitting(false)
    // })

    setIsItemBeingAdded(false);
  };
  console.log(cartItemData);
  const remove = async () => {
    setIsItemBeingAdded(true);
    await onItemAddorRemoveToCart(
      itemData,
      savedUserInfo.lastOrderId,
      "remove"
    );
    setIsItemBeingAdded(false);
  };

  return (
    <>
      <ServiceSeo />
      <div className="flex items-center gap-1 rounded-lg border-t bg-white px-4 py-3">
        <div className="relative h-20 w-20 rounded-md bg-gray-200">
          <img fill src={itemData?.icon} className="p-2" alt="" />
        </div>
        <div className="grow space-y-1 px-3 font-medium">
          <p>{itemData.name}</p>
          <p className="font-semibold">
            <strike className="text-dim">${itemData.mrp}</strike>
            <span className="pl-1 text-green-600">{itemData.discount}%</span>
          </p>
          <p>${itemData.price}</p>
        </div>
        <div className="space-y-1">


          {cartItemData ? (
            <div className="w- flex items-center overflow-hidden rounded-full border-2 border-orange-400">
              <button
                disabled={isItemBeingAdded}
                onClick={remove}
                className={`shrink-0 py-1.5 ${isItemBeingAdded ? "px-3" : "px-4"
                  } font-semibold text-orange-400`}
              // className={`shrink-0 py-1.5 px-4 font-semibold text-orange-400`}
              >
                -
              </button>
              {isItemBeingAdded ? (
                <LoadingSpinnerItemOrange />
              ) : (
                <span className="grow px-2 text-center font-medium">
                  {cartItemData.qty}
                </span>
              )}
              <button
                disabled={isItemBeingAdded}
                onClick={add}
                className={`shrink-0 py-1.5 px-4 font-semibold text-orange-400`}
              // className={`shrink-0 py-1.5 ${isItemBeingAdded ? 'px-3' : 'px-4'} font-semibold text-orange-400`}
              >
                +
              </button>
            </div>
          ) : (isItemBeingAdded ? (
            <>
              <LoadingSpinnerItemOrange />
            </>
          ) : (
            <>
              <button
                onClick={add}
                className="w-28 rounded-full border-2 border-transparent bg-orange-400 px-5 py-1.5 font-medium text-white">
                Add
              </button>
            </>)

          )}





          <p className="text-center text-gray-500">{itemData.unitType}</p>
        </div>
      </div>
    </>
  );
}

export default function Services() {
  const router = useRouter();

  const {
    deliveryInformation,
    setDeliveryInformation,
    savedUserInfo,
    setSavedUserInfo,
    servicesCategories,
    fetchSavedUserInfo,
    fetchServicesCategories,
    fetchItemList,
    isServicesLoading,
    itemsInCart,
    isItemsInCartLoading,
    serviceFAQ,
    isServiceFAQLoading,
    itemsList,
    isItemsListLoading,
    selectedCategory,
    setSelectedCategory,
    userOrderInfo,
    onPickupInstructionChange,
    onDeliveryInstructionChange,
    onMakePayment,
  } = useServicesContext();

  const [pickupLocationModalOpen, setPickupLocationModalOpen] = useState(false);
  const closePickupLocationModal = () => setPickupLocationModalOpen(false);

  const [deliveryLocationModalOpen, setDeliveryLocationModalOpen] =
    useState(false);
  const closeDeliveryLocationModal = () => setDeliveryLocationModalOpen(false);

  const [pickupTimeModalOpen, setPickupTimeModalOpen] = useState(false);

  const [showCouponsModal, setShowCouponsModal] = useState(false);

  const closePickupTimeModal = () => setPickupTimeModalOpen(false);

  const [deliveryTimeModalOpen, setDeliveryTimeModalOpen] = useState(false);
  const closeDeliveryTimeModal = () => setDeliveryTimeModalOpen(false);

  const [showSidePanel, setShowSidePanel] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (showSidePanel) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showSidePanel]);

  const onServiceCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchItemList(category.id);
  };

  useEffect(() => {
    fetchServicesCategories();
    fetchSavedUserInfo();
  }, []);

  const onPickupAddressSet = (pickupId, pickupAddressInfo) => {
    console.log(pickupAddressInfo)
    setDeliveryInformation({
      ...deliveryInformation,
      pickupAddress: pickupAddressInfo.placeAddress,
      pickupAddressType: pickupAddressInfo.addressType,
      pickupAddressCity: pickupAddressInfo.city,
      pickupAddressId: pickupId,
      pickupHouseNo: pickupAddressInfo.houseNo,
      pickupStreet: pickupAddressInfo.street,
      pickupPlaceAddress: pickupAddressInfo.placeAddress
    });
    setSavedUserInfo((prev) => ({
      ...prev,
      pickupAddress: pickupAddressInfo,
    }));
    closePickupLocationModal();
  };

  const onDeliveryAddressSet = (deliveryId, deliveryAddressInfo) => {
    setDeliveryInformation({
      ...deliveryInformation,
      deliveryAddress: deliveryAddressInfo.placeAddress,
      deliveryAddressType: deliveryAddressInfo.addressType,
      deliveryAddressCity: deliveryAddressInfo.city,
      deliveryAddressId: deliveryId,
      deliveryHouseNo: deliveryAddressInfo.houseNo,
      deliveryStreet: deliveryAddressInfo.street,
      deliveryPlaceAddress: deliveryAddressInfo.placeAddress
    });
    setSavedUserInfo((prev) => ({
      ...prev,
      deliveryAddress: deliveryAddressInfo,
    }));
    closeDeliveryLocationModal();
  };

  const onDeliveryTimeSave = (selectedTimeInfo) => {
    const { date, timeSlot, id, timeSlotId } = selectedTimeInfo;
    setDeliveryInformation((prev) => ({
      ...prev,
      preferrdDeliveryId: id,
      deliveryTimeSlot: timeSlot,
      deliveryDate: date,
      preferrdDeliveryTime: timeSlotId,
    }));
    closeDeliveryTimeModal();
  };

  const onPickupTimeSave = (selectedTimeInfo) => {
    const { date, timeSlot, id, timeSlotId } = selectedTimeInfo;
    setDeliveryInformation((prev) => ({
      ...prev,
      pickupDate: date,
      pickupTimeSlot: timeSlot,
      preferrdPickupId: id,
      preferrdPickupTime: timeSlotId,
    }));
    setDeliveryInformation((prev) => ({
      ...prev,
      preferrdDeliveryId: "",
      deliveryTimeSlot: "",
      deliveryDate: "",
      preferrdDeliveryTime: "",
    }));
    closePickupTimeModal();
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [saveInformationError, setSaveInformationError] = useState({
    hasError: true,
    message: "",
  });

  const onSaveSessionClick = async () => {
    setIsSubmitting(true);
    const {
      pickupAddressId,
      deliveryAddressId,
      preferrdPickupId,
      preferrdDeliveryId,
      preferrdPickupTime,
      preferrdDeliveryTime,
      pickupInstruction,
      deliveryInstruction,
      pickupHouseNo,
    } = deliveryInformation;

    // if (!preferrdPickupId || !preferrdDeliveryId || !preferrdPickupTime || !preferrdDeliveryTime) {
    //   setSaveInformationError({
    //     hasError: true,
    //     message: "Please select all fields"
    //   })
    //   setIsSubmitting(false)
    //   return
    // }

    if (!preferrdPickupTime) {
      setSaveInformationError({
        hasError: true,
        message: "Please Select Pickup Date-Time",
      });
      setIsSubmitting(false);
      return;
    }
    if (!preferrdDeliveryTime) {
      setSaveInformationError({
        hasError: true,
        message: "Please Select Delivery Date-Time",
      });
      setIsSubmitting(false);
      return;
    }
    if (!pickupAddressId && !savedUserInfo?.pickupAddress?.id) {
      setSaveInformationError({
        hasError: true,
        message: "Please Select Pickup Address",
      });
      setIsSubmitting(false);
      return;
    }
    if (!preferrdDeliveryId && !savedUserInfo?.deliveryAddress?.id) {
      setSaveInformationError({
        hasError: true,
        message: "Please Select Pickup Address",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await axios
        .post(
          servicesConfig.saveUserSessionEndpoint,
          {
            pickupAddressId:
              pickupAddressId || savedUserInfo?.pickupAddress?.id,
            deliveryAddressId:
              deliveryAddressId || savedUserInfo?.deliveryAddress?.id,
            preferrdPickupId,
            preferrdDeliveryId,
            preferrdPickupTime,
            preferrdDeliveryTime,
            pickupInstruction,
            deliveryInstruction,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer " +
                window.localStorage.getItem(authConfig.storageTokenKeyName),
            },
          }
        )
        .then(() => {
          if (savedUserInfo.lastOrderId) {
            axios.put(
              servicesConfig.applyCouponEndpoint,
              {
                orderId: savedUserInfo.lastOrderId,
                pickupAddressId:
                  pickupAddressId || savedUserInfo.pickupAddress.id,
                deliveryAddressId:
                  deliveryAddressId || savedUserInfo.deliveryAddress.id,
                pickupTimeId: preferrdPickupId,
                deliveryTimeId: preferrdDeliveryId,
                // preferrdPickupTime,
                // preferrdDeliveryTime,
                pickupInstruction,
                deliveryInstruction,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization:
                    "Bearer " +
                    window.localStorage.getItem(authConfig.storageTokenKeyName),
                },
              }
            );
          }

          setSaveInformationError({
            hasError: false,
            message: "",
          });
          fetchSavedUserInfo();
        });
      setIsSubmitting(false);
    } catch (error) {
      console.error("error on saving information", error);
      setSaveInformationError({
        hasError: true,
        message: "Please check the fields once again!",
      });
      setIsSubmitting(false);
    }
  };

  const [couponData, setCouponData] = useState("");
  const [isCouponBeingApplied, setIsCouponBeingApplied] = useState(false);
  const onCouponCodeEnter = (event) => {
    setCouponData(event.target.value);
    setCouponErrors({
      hasError: false,
      message: "",
    });
  };

  const [couponErrors, setCouponErrors] = useState({
    hasError: false,
    message: "",
    isSuccess: true,
  });

  // this function was called before I changed the onclick action on apply coupon button to open coupons list. You can now call this function when user clicks coupon card or similar logic.
  const onApplyCouponBtnClick = async (name) => {
    setIsCouponBeingApplied(true);
    setShowCouponsModal(false)
    try {
      await axios.put(
        servicesConfig.applyCouponEndpoint,
        {
          couponCode: name,
          orderId: userOrderInfo.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " +
              window.localStorage.getItem(authConfig.storageTokenKeyName),
          },
        }
      );

      setCouponErrors({
        hasError: false,
        message: "Coupon applied successfully",
        isSuccess: true,
      });
      fetchSavedUserInfo();
    } catch (error) {
      console.error("error on applying coupon", error.response.data.message);
      setCouponErrors({
        hasError: true,
        message: error.response.data.message,
      });
    }
    setIsCouponBeingApplied(false);
  };
  // const onApplyCouponBtnClick = async () => {
  //   setIsCouponBeingApplied(true);
  //   try {
  //     await axios.put(
  //       servicesConfig.applyCouponEndpoint,
  //       {
  //         couponCode: couponData,
  //         orderId: userOrderInfo.id,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization:
  //             "Bearer " +
  //             window.localStorage.getItem(authConfig.storageTokenKeyName),
  //         },
  //       }
  //     );
  //     setCouponErrors({
  //       hasError: false,
  //       message: "Coupon applied successfully",
  //       isSuccess: true,
  //     });
  //     fetchSavedUserInfo();
  //   } catch (error) {
  //     console.error("error on applying coupon", error.response.data.message);
  //     setCouponErrors({
  //       hasError: true,
  //       message: error.response.data.message,
  //     });
  //   }
  //   setIsCouponBeingApplied(false);
  // };

  const makePayment = async () => {
    const {
      pickupAddressId,
      deliveryAddressId,
      preferrdPickupId,
      preferrdDeliveryId,
      preferrdPickupTime,
      preferrdDeliveryTime,
      pickupInstruction,
      deliveryInstruction,
    } = deliveryInformation;

    if (
      preferrdDeliveryId == "" ||
      preferrdDeliveryTime == "" ||
      preferrdPickupId == "" ||
      preferrdPickupTime == ""
    ) {
      setOpenAlert(true);
      setTitle("Error");
      setType("error");
      setMsg("Please select pickup and delivery date time!");
      return;
    }

    if (
      preferrdDeliveryId != savedUserInfo?.preferrdDeliveryId ||
      preferrdDeliveryTime != savedUserInfo.preferrdDeliveryTime ||
      preferrdPickupId != savedUserInfo.preferrdPickupId ||
      preferrdPickupTime != savedUserInfo.preferrdPickupTime
    ) {
      setOpenAlert(true);
      setTitle("Error");
      setType("error");
      setMsg("Please save the new selected details first!");
      return;
      // return { status: false, message: '' }
    }

    // const { onMakePayment, savedUserInfo } = useServicesContext()
    // setIsItemBeingAdded(true)

    onMakePayment(savedUserInfo.lastOrderId, (response) => {
      if (response.status === true) {
        router.push(response.message);
      } else {
        setOpenAlert(true);
        setTitle("Error");
        setType("error");
        setMsg(response.message);
      }
    });

    // setIsItemBeingAdded(false)
  };

  const [openAlert, setOpenAlert] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("confirm");
  const [msg, setMsg] = useState("");

  const closeDialog = () => {
    if (type == "success") {
      // reset()
    }
    setOpenAlert(false);
  };



  const [couponList, setCouponList] = useState([])
  const openCuponDialog = () => {
    const headers = {
      Accept: 'application/json',
      // 'Content-Type': 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + window.localStorage.getItem(authConfig.storageTokenKeyName)
    }


    // const response = await axios.get(subscriptionConfig.getMembershipDetails,
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + window.localStorage.getItem(authConfig.storageTokenKeyName)
    //     }
    //   });

    const storedToken =
      "Bearer " + window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      axios.get(servicesConfig.getCouponsEndPoint, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem(authConfig.storageTokenKeyName)
        }
      })
        .then(async (res) => {
          // console.log(res.data.data.data)
          setCouponList(res.data.data.data)
          // setOtpDialogOpen(true)
        })
    } catch (e) {
      setCouponList([])
      // setSaveLoading(false)
    }
    setShowCouponsModal(true)
  }





  return (
    <>
      <Modal isOpen={pickupTimeModalOpen} onClose={closePickupTimeModal}>
        <TimeSlotPicker
          deliveryInformation={deliveryInformation}
          pickerFor="pickupDate"
          onSaveBtnClick={onPickupTimeSave}
          title="Pickup Time Slot"
          subtitle="When would you like your items to be picked up?"
        />
      </Modal>

      <Modal
        isOpen={showCouponsModal}
        onClose={() => setShowCouponsModal(false)}
        className="z-[2000]">
        <div className="flex max-h-screen flex-col md:max-h-[70vh]">
          <h1 className="border-b p-5 font-semibold md:text-xl">
            Select a Coupon
          </h1>
          <div className="grow overflow-auto bg-gray-100 p-5 md:p-6">
            <div className="grid space-y-6 mdd:grid-cols-2">
              {
                couponList.map((coupon, index) => {
                  return (<CouponCard key={index} coupon={coupon} setCouponData={setCouponData} onApplyCouponBtnClick={onApplyCouponBtnClick} />)
                })
              }
            </div>

            {/* if empty, render the div below and hide the above div*/}
            {/* <div className="flex items-center justify-center py-10 px-5 font-semibold text-gray-400">
              No Coupons
            </div> */}
          </div>
        </div>
      </Modal>

      <Modal isOpen={deliveryTimeModalOpen} onClose={closeDeliveryTimeModal}>
        <TimeSlotPicker
          deliveryInformation={deliveryInformation}
          pickerFor="deliveryDate"
          onSaveBtnClick={onDeliveryTimeSave}
          title="Delivery Time Slot"
          subtitle="When would you like your items to be delivered?"
        />
      </Modal>
      <AlertDialog
        isOpen={openAlert}
        onClose={closeDialog}
        type={type}
        title={title}
        content={msg}
      />

      {pickupLocationModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-900 bg-opacity-80"
            onClick={closePickupLocationModal}
          />
          <div className="absolute inset-0 w-full overflow-hidden bg-white md:relative md:max-w-4xl md:rounded-xl md:shadow-xl md:transition-all">
            <ChooseLocation onSaveAddress={onPickupAddressSet} />
            <button
              onClick={closePickupLocationModal}
              className="absolute top-4 right-4 z-30 text-gray-400 hover:text-gray-900">
              <XMarkIcon className="h-6 w-6 md:h-5 md:w-5" />
            </button>
          </div>
        </div>
      )}

      {deliveryLocationModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-900 bg-opacity-80"
            onClick={closeDeliveryLocationModal}
          />
          <div className="absolute inset-0 w-full overflow-hidden bg-white md:relative md:max-w-4xl md:rounded-xl md:shadow-xl md:transition-all">
            <ChooseLocation onSaveAddress={onDeliveryAddressSet} />
            <button
              onClick={closeDeliveryLocationModal}
              className="absolute top-4 right-4 z-30 text-gray-400 hover:text-gray-900">
              <XMarkIcon className="h-6 w-6 md:h-5 md:w-5" />
            </button>
          </div>
        </div>
      )}

      <HeaderHome />
      <div className="pb-20 lg:flex lg:pb-10">
        <div className="grow space-y-8 py-3 lg:mr-[32rem]">
          <div className="container py-4">
            <div className="lg:block">
              <h2 className="text-xl font-semibold">
                Schedule your laundry items
              </h2>
              <div className="ld:grid-cols-3 mt-4 grid gap-4 md:grid-cols-2">
                {/* pickup address */}
                <div
                  onClick={() => {
                    setSaveInformationError({
                      hasError: false,
                      message: "",
                    });
                    setPickupLocationModalOpen(true);
                  }}
                  className="cursor-pointer rounded-lg bg-gray-100 px-3 py-2">
                  <div className="mb-0.5 text-sm font-medium text-dark/70">
                    Pickup Address
                  </div>
                  <div className="flex items-center text-lg font-medium">
                    <RiMapPin2Fill size={18} className="flex-shrink-0 mr-2 text-primary" />
                    <span>
                      {!!deliveryInformation.pickupAddress ||
                        !!savedUserInfo?.pickupAddress?.placeAddress ? (
                        <>
                          {deliveryInformation.pickupAddress
                            ? `(${deliveryInformation?.pickupAddressType}) ${deliveryInformation.pickupHouseNo} ${deliveryInformation.pickupStreet} ${deliveryInformation.pickupPlaceAddress}`
                            : `(${savedUserInfo?.pickupAddress?.addressType}) ${savedUserInfo?.pickupAddress?.houseNo} ${savedUserInfo?.pickupAddress?.street} ${savedUserInfo?.pickupAddress?.placeAddress}`
                          }
                        </>
                      ) : (
                        "Select Pickup Address"
                      )}
                    </span>
                  </div>
                </div>
                {/* delivery address */}
                <div
                  onClick={() => {
                    setSaveInformationError({
                      hasError: false,
                      message: "",
                    });
                    setDeliveryLocationModalOpen(true);
                  }}
                  className="cursor-pointer rounded-lg bg-gray-100 px-3 py-2">
                  <div className="mb-0.5 text-sm font-medium text-dark/70">
                    Delivery Address
                  </div>
                  <div className="flex items-center text-lg font-medium">
                    <RiMapPin2Fill size={18} className="mr-2 flex-shrink-0 text-primary" />
                    <span>
                      {!!deliveryInformation?.deliveryAddress ||
                        !!savedUserInfo?.deliveryAddress?.placeAddress ? (
                        <>
                          {
                            // deliveryInformation.deliveryAddress ? deliveryInformation.deliveryAddress : `(${savedUserInfo?.deliveryAddress?.addressType}) ${savedUserInfo?.deliveryAddress?.city}`
                            deliveryInformation.deliveryAddress
                              ? `(${deliveryInformation?.deliveryAddressType}) ${deliveryInformation.deliveryHouseNo} ${deliveryInformation.deliveryStreet} ${deliveryInformation.deliveryPlaceAddress}`
                              : `(${savedUserInfo?.deliveryAddress?.addressType}) ${savedUserInfo?.deliveryAddress?.street} ${savedUserInfo?.deliveryAddress?.placeAddress}`
                          }
                        </>
                      ) : (
                        "Select Pickup Address"
                      )}
                    </span>
                  </div>
                </div>
                {/* pickup date */}
                <div
                  onClick={() => {
                    setSaveInformationError({
                      hasError: false,
                      message: "",
                    });
                    setPickupTimeModalOpen(true);
                  }}
                  className="cursor-pointer rounded-lg bg-gray-100 px-3 py-2">
                  <div className="mb-0.5 text-sm font-medium text-dark/70">
                    Pickup time slot
                  </div>
                  <div className="flex items-center text-lg font-medium">
                    <RiCalendarFill size={18} className="mr-2 flex-shrink-0 text-primary" />
                    <span>
                      {deliveryInformation.pickupDate &&
                        deliveryInformation.pickupTimeSlot
                        ? getInitialsFromDate(
                          deliveryInformation.pickupDate,
                          "LLLL, dd, yyyy"
                        ) +
                        " " +
                        `( ${deliveryInformation.pickupTimeSlot} )`
                        : "Select Pickup Date"}
                    </span>
                  </div>
                </div>
                {/* delivery date */}

                <div
                  onClick={() => {
                    setSaveInformationError({
                      hasError: false,
                      message: "",
                    });
                    setDeliveryTimeModalOpen(true);
                  }}
                  className="cursor-pointer rounded-lg bg-gray-100 px-3 py-2">
                  <div className="mb-0.5 text-sm font-medium text-dark/70">
                    Delivery time slot
                  </div>
                  <div className="flex items-center text-lg font-medium">
                    <RiCalendarFill size={18} className="mr-2 flex-shrink-0 text-primary" />
                    {/* Next day  */}
                    <span>
                      {deliveryInformation.deliveryDate &&
                        deliveryInformation.deliveryTimeSlot
                        ? getInitialsFromDate(
                          deliveryInformation.deliveryDate,
                          "LLLL, dd, yyyy"
                        ) +
                        " " +
                        `( ${deliveryInformation.deliveryTimeSlot} )`
                        : "Select Delivery Date"}
                    </span>
                    {/* <span>{getInitialsFromDate(new Date(+new Date() + 86400000 * 3), "MMMM dd, yyyy")}&nbsp;{'( 08:00 - 10:00 )'}</span> */}
                  </div>
                </div>
                {/* pickup instruction */}
                <div className="cursor-pointer rounded-lg bg-gray-100 px-3 py-2">
                  <div className="mb-0.5 text-sm font-medium text-dark/70">
                    Pickup Driver instructions
                  </div>
                  <select
                    defaultValue={
                      !!deliveryInformation?.pickupInstruction ||
                        !!savedUserInfo?.pickupInstruction
                        ? deliveryInformation?.pickupInstruction ||
                        savedUserInfo?.pickupInstruction
                        : ""
                    }
                    onChange={onPickupInstructionChange}
                    className="input-reset w-full text-lg font-medium">
                    <option value="Knock_or_ring_the_doorbell">Knock or ring the doorbell</option>
                    <option value="Call_me">Call me</option>
                    <option value="I’ll_leave_it_outside
">I’ll leave it outside
                    </option>
                  </select>
                </div>
                {/* delivery instruction */}
                <div
                  // onClick={() => setDeliveryTimeModalOpen(true)}
                  className="cursor-pointer rounded-lg bg-gray-100 px-3 py-2">
                  <div className="mb-0.5 text-sm font-medium text-dark/70">
                    Delivery Driver instructions
                  </div>
                  <select
                    defaultValue={
                      !!deliveryInformation?.deliveryInstruction ||
                        !!savedUserInfo?.deliveryInstruction
                        ? deliveryInformation?.deliveryInstruction ||
                        savedUserInfo?.deliveryInstruction
                        : ""
                    }
                    onChange={onDeliveryInstructionChange}
                    className="input-reset w-full text-lg font-medium">
                    <option value="Knock_or_ring_the_doorbell">Knock or ring the doorbell</option>
                    <option value="Call_me">Call me</option>
                    <option value="I’ll_leave_it_outside
">I’ll leave it outside
                    </option>
                  </select>
                </div>
                {/* save button */}
                {isSubmitting ? (
                  <LoadingButton />
                ) : (
                  <button
                    className="btn btn-primary w-52 text-sm"
                    onClick={onSaveSessionClick}>
                    Save Information
                  </button>
                )}
              </div>
              {saveInformationError.hasError ? (
                <div className="mt-2 text-sm font-medium text-red-500">
                  {saveInformationError.message}
                </div>
              ) : null}
            </div>
          </div>
          <div>
            <h2 className="container text-xl font-semibold">
              Services Categories
            </h2>
            <div className="md:container w-full overflow-hidden">
              <div className="mt-4 flex gap-6 overflow-auto bg-gray-100 px-6 pt-6 pb-8 md:flex-wrap md:rounded-xl">
                {isServicesLoading ? (
                  <>
                    <LoadingSpinner position={"center"} />
                  </>
                ) : (
                  <>
                    {servicesCategories.length > 0 ? (
                      servicesCategories.map((category, index) => (
                        <>
                          <div
                            key={"service" + category.id}
                            className="h-28 w-28 shrink-0 cursor-pointer rounded-2xl bg-white p-3"
                            onClick={() => onServiceCategoryClick(category)}>
                            {/* Im using index as example, in real use case, it would be something like isSelected or whatever*/}
                            <div
                              className={`relative h-full w-full rounded-xl ${selectedCategory.id === category.id
                                ? "bg-[#DAFFE9]"
                                : ""
                                }`}>
                              <img
                                fill
                                src={category.icon}
                                className="h-full w-full object-contain p-4"
                                alt=""
                              />
                            </div>
                            <p
                              className={` ${selectedCategory.id === category.id
                                ? "text-slate-900"
                                : "text-slate-500"
                                }  mt-4 text-center text-xs capitalize`}>
                              {category.name}
                            </p>
                          </div>
                        </>
                      ))
                    ) : (
                      <div className="text-center">No Services Available</div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div>
            <div className="container grid grid-cols-2 gap-3">
              <h2 className="p-1 font-semibold">Item List</h2>
              <h2 className="hidden p-1 font-semibold lg:block">Learn More</h2>
            </div>
            <div className="md:container">
              <div className="mt-2 flex flex-col gap-3 bg-gray-100 p-3 md:flex-row-reverse md:rounded-xl">
                {isServiceFAQLoading ? (
                  <LoadingSpinner position={"center"} />
                ) : (
                  <div className="w-full rounded-xl bg-gray-100">
                    <div className="divide-y overflow-hidden rounded-lg border">
                      {serviceFAQ.length > 0 ? (
                        serviceFAQ.map((faq, index) => (
                          <Accordion
                            key={faq.id}
                            classNames="bg-white"
                            title={
                              <div className="flex items-center gap-2">
                                <RiInformationFill size={18} className="shrink-0" />
                                <span>{faq.title}</span>
                              </div>
                            }>
                            <div className="border-t p-4 text-sm">
                              {faq.description}
                            </div>
                          </Accordion>
                        ))
                      ) : (
                        <div className="text-center">No FAQs Available</div>
                      )}
                    </div>
                  </div>
                )}
                <div className="w-full space-y-3 rounded-xl bg-gray-100">
                  {isItemsListLoading ? (
                    <>
                      <LoadingSpinner position={"center"} />
                    </>
                  ) : (
                    <>
                      {itemsList.length > 0 ? (
                        itemsList.map((item, index) => (
                          <ServiceAddCard
                            itemData={item}
                            key={item.id}
                            saveInformationError={saveInformationError}
                            setSaveInformationError={setSaveInformationError}
                          />
                        ))
                      ) : (
                        <div className="text-center">No Items Available</div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${showSidePanel ? "flex" : "hidden"
            } fixed inset-y-0 right-0 z-[1000] w-full flex-col overflow-hidden border-l bg-white lg:z-40 lg:flex lg:w-[32rem] lg:pt-20`}>
          <div className="flex items-center justify-between border-b p-4 lg:hidden">
            <div className="text-lg font-semibold">Cart</div>
            <button
              onClick={() => setShowSidePanel(false)}
              className="text-gray-400 hover:text-gray-900">
              <XMarkIcon className="h-6 w-6 md:h-5 md:w-5" />
            </button>
          </div>
          <div className="grow space-y-6 overflow-auto bg-gray-50 p-2">
            <div className="space-y-2">
              <div className="bg-white p-3 text-lg font-medium">
                Added Services
              </div>
              {isItemsInCartLoading ? (
                <LoadingSpinner position={"center"} />
              ) : (
                <>
                  {itemsInCart.length > 0 ? (
                    itemsInCart.map((singleCategory, index) => (
                      <Accordion
                        key={index}
                        classNames="bg-white"
                        title={singleCategory[0]}>
                        {singleCategory[1][0].map((item, index) => (
                          <ServiceAddCard
                            key={index}
                            itemData={item.itemData}
                            itemAllData={item}
                          />
                        ))}
                      </Accordion>
                    ))
                  ) : (
                    <div className="text-center">No Items Added</div>
                  )}
                </>
              )}
            </div>
            <div className="bg-white">
              <div className="border-b p-3 text-base font-medium">
                Offer and Discounts
              </div>
              <div className="flex items-center justify-between gap-3 p-1">
                {/* {
                  couponErrors.hasError && !couponErrors.isSuccess && <div className="text-red-500 text-sm">{couponErrors.message}</div>
                }
                {
                  !couponErrors.hasError && couponErrors.isSuccess && <div className="text-green-500 text-sm">{couponErrors.message}</div>
                } */}


                {/* {couponErrors.hasError && !couponErrors.isSuccess && (
                  <div className="text-sm text-red-500">
                    {couponErrors.message}
                  </div>
                )} */}
                {userOrderInfo?.couponData?.length == 1 && (
                  <div className="text-sm text-green-500">
                    {"Coupon Applied"}
                  </div>
                )}

                <input
                  type="text"
                  className="input-reset w-full rounded bg-gray-100 p-3"
                  placeholder={`${!!userOrderInfo?.couponData?.length
                    ? userOrderInfo?.couponData?.[0]?.name
                    : ""
                    }`}
                  // disabled={!!userOrderInfo?.couponData?.length}
                  disabled
                  onChange={onCouponCodeEnter}
                  value={couponData}
                />
                <button
                  onClick={() => openCuponDialog()}
                  // disabled={
                  //   !!userOrderInfo?.couponData?.length || isCouponBeingApplied
                  // }
                  className="btn btn-primary flex w-52 items-center gap-2 whitespace-nowrap p-3 text-sm">
                  {isCouponBeingApplied ? (
                    <span>Applying Coupon... </span>
                  ) : (
                    <>
                      <RiPercentFill size={18} className="text-white" />
                      {!!userOrderInfo?.couponData?.length ? (
                        <>
                          <span>Change Coupon</span>
                        </>
                      ) : (
                        <>
                          <span>Apply Coupon</span>
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
              {couponErrors.hasError && !couponErrors.isSuccess && (
                <div className="text-sm text-red-500  flex items-center justify-between gap-3 p-2">
                  {couponErrors.message}
                </div>
              )}
            </div>
            <div className="bg-white pb-12">
              <div className="border-b p-4 text-lg font-medium">
                Bill Details
              </div>
              {userOrderInfo && (
                <>
                  <div className="space-y-3 px-4 py-3">
                    <div className="flex justify-between">
                      <span className="text-dim">
                        Price Total (Paid Services Added )
                      </span>
                      <span className="font-medium text-body">
                        $
                        {userOrderInfo?.orderAmount
                          ? userOrderInfo?.orderAmount
                          : 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dim">Discount</span>
                      <span className="font-medium text-green-600">
                        {userOrderInfo?.couponData?.[0]?.percentage
                          ? userOrderInfo?.taxes?.discount + "%"
                          : userOrderInfo?.couponData?.[0]?.percentage == false
                            ? "$" + userOrderInfo?.taxes?.discount
                            : "$0"}
                      </span>
                    </div>
                  </div>
                  <div className="my-1 space-y-3 border-y-2 border-dashed p-4">
                    <div className="flex justify-between">
                      <span className="text-dim">Service Fees</span>
                      <span className="font-medium text-body">
                        $
                        {userOrderInfo?.taxes?.service_fee
                          ? userOrderInfo?.taxes?.service_fee
                          : 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dim">Ride Charges</span>
                      <span className="font-medium text-body">
                        $
                        {userOrderInfo?.taxes?.pickup_delivery
                          ? userOrderInfo?.taxes?.pickup_delivery
                          : 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dim">Tax</span>
                      <span className="font-medium text-body">
                        $
                        {userOrderInfo?.taxes?.tax
                          ? userOrderInfo?.taxes?.tax
                          : 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dim">Amount </span>
                      <span className="font-medium text-body">
                        $
                        {userOrderInfo?.finalAmount
                          ? userOrderInfo?.finalAmount?.toFixed(2)
                          : 0}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between px-4 py-3 text-lg font-semibold">
                      <span>Total</span>
                      <span>
                        $
                        {userOrderInfo?.orderTotalAmount
                          ? userOrderInfo?.orderTotalAmount?.toFixed(2)
                          : 0}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="border-t bg-white p-4">
            {itemsInCart.length > 0 ? (
              <button
                onClick={() => makePayment()}
                className="btn-primary"
              >
                Make Payment
              </button>
            ) : (
              <button
                disabled
                className="btn-primary"
              >
                No Item Added
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 h-20 bg-white p-4 lg:hidden">
        <button onClick={() => setShowSidePanel(true)} className="btn-primary">
          Proceed to Payment
        </button>
      </div>
    </>
  );
}
