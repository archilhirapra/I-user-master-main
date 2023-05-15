// import UserDashboardLayout from "../../../components/UserDashboardLayout";
import UserDashboardLayout from "../../../components/account/UserDashboardLayout";
import React from "react";
import Accordion from "../../../components/account/Accordion";
import Image from "next/future/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
import authConfig from "src/configs/auth";
import bookingConfigs from "src/configs/bookingConfigs";
import { getInitialsFromDate } from "src/helper/formatDate";
import { formatTime } from "src/helper/formatTime";
import { categorizeByCategoryName } from "src/helper/categorizeOrderItems";
import LoadingSpinner from "src/components/LoadingSpinner";
import LoadingSkeleton from "src/components/LoadingSkeleton";
import { getClassNameFromStatus, getTitleFromStatus } from "src/components/account/BookingCard";
import { createdAtFromDate } from "src/helper/createdAtformatDate";


const getPaymentStatusFromStatusCode = {
  0: "Pending",
  1: "Paid",
  2: "Refund",
  3: "Cancelled",
}

export default function Booking() {

  const router = useRouter();
  const { id: orderId } = router.query;

  const [orderInformation, setOrderInformation] = React.useState({});
  const [orderInformationLoading, setOrderInformationLoading] = React.useState(true);
  const [categorizedOrderItems, setCategorizedOrderItems] = React.useState([]);

  useEffect(() => {
    getOrderInformation();
  }, [])

  const getOrderInformation = async () => {
    try {
      const response = await axios.get(
        `${bookingConfigs.getUserOrdersEndpoint}?orderId=${orderId}`,
        {
          headers: {
            Authorization: "Bearer " + window.localStorage.getItem(authConfig.storageTokenKeyName),
          },
        }
      );
      setOrderInformation(response.data.data.data);
      setCategorizedOrderItems(categorizeByCategoryName(response.data.data.data.orderItems))
      setOrderInformationLoading(false);
    } catch (error) {
      // console.log("error in fetching order information", error);
    }
    setOrderInformationLoading(false);
  }




  const PaymentButton = () => {
    if (orderInformation.status == 0 || orderInformation.status == 1) {
      return (
        <>
          <div className="px-4">
            <button className="btn btn-primary mx-auto my-6 block px-10 py-2 md:w-max">
              Pay
            </button>
          </div>
        </>
      )
    }
  }
  const CancelButton = () => {
    if (orderInformation.status == 0 || orderInformation.status == 1) {
      return (
        <>
          <button className="btn btn-primary bg-gray-300  mx-auto my-6 block px-10 py-2 md:w-max">
            Cancel
          </button>
        </>
      )
    }
  }









  return (
    <>
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
        <div className="space-y-5">
          <div className="overflow-hidden rounded-xl border bg-white">
            <div className="border-b p-4 text-lg font-medium">Time Slot</div>
            {
              orderInformationLoading ? <LoadingSkeleton /> :
                <div className="space-y-8 p-4">
                  <div>
                    <p className="font-medium">Created At</p>
                    <p className="text-sm text-dim">
                      {createdAtFromDate(orderInformation.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Updated At</p>
                    <p className="text-sm text-dim">
                      {createdAtFromDate(orderInformation.updatedAt)}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Pickup Time</p>
                    <p className="text-sm text-dim">
                      {getInitialsFromDate(orderInformation.pickupDate)} ({formatTime(orderInformation.pickupTime)})
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Delivery Time</p>
                    <p className="text-sm text-dim">
                      {getInitialsFromDate(orderInformation.deliveryDate)} ({formatTime(orderInformation.deliveryTime)})
                    </p>
                  </div>
                </div>


            }
          </div>
          <div className="overflow-hidden rounded-xl border bg-white">
            <div className="border-b p-4 text-lg font-medium">
              Purchased Services
            </div>
            <div className="divide-y text-sm">
              {
                orderInformationLoading ? <LoadingSkeleton /> :
                  <>
                    {
                      categorizedOrderItems.length > 0 ? categorizedOrderItems.map((singleCategory, index) => (
                        <Accordion key={index} classNames="bg-white" title={singleCategory[0]}>
                          {
                            singleCategory[1][0].map((item, index) => <ItemCard key={index} itemData={item.itemData} itemAllData={item} />)
                          }
                        </Accordion>
                      )) : <div className="text-center">No Items Added</div>
                    }
                  </>
              }
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="space-y-5">
            <div className="overflow-hidden rounded-xl border bg-white">
              <div className="border-b p-4 text-lg font-medium">Bill Details</div>
              {
                orderInformationLoading ? <LoadingSkeleton /> :
                  <div className="space-y-3 px-4 py-3">
                    <div className="flex justify-between">
                      <span className="text-dim">
                        Price Total (Paid Services Added )
                      </span>
                      <span className="font-medium text-body">${(orderInformation?.orderAmount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dim">Discount</span>
                      <span className="font-medium text-green-600">{orderInformation?.taxes?.discount}</span>
                    </div>
                  </div>
              }
              <div className="my-1 space-y-3 border-y-2 border-dashed p-4">
                {
                  orderInformationLoading ? <LoadingSkeleton /> :
                    <>
                      <div className="flex justify-between">
                        <span className="text-dim">Service Fees</span>
                        <span className="font-medium text-body">${orderInformation?.taxes?.service_fee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-dim">Ride Charges</span>
                        <span className="font-medium text-body">${orderInformation?.taxes?.pickup_delivery}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-dim">Tax</span>
                        <span className="font-medium text-body">${orderInformation?.taxes?.tax}</span>
                      </div>
                    </>
                }
              </div>
              <div>
                {
                  orderInformationLoading ? <LoadingSkeleton /> :
                    <>
                      <div
                        className={`rounded-t-lg p-3 text-center font-semibold ${getClassNameFromStatus[orderInformation.status] || getClassNameFromStatus["default"]}`}
                      >
                        {getTitleFromStatus[orderInformation.status] || getTitleFromStatus["default"]}
                      </div>
                      <div className="flex items-center justify-between px-4 py-3 text-lg font-semibold">
                        <span>Total Amount</span>
                        <span>${(orderInformation?.orderTotalAmount).toFixed(2)}</span>
                      </div>
                      <div className="px-4 flex flex-row gap-3">
                        {/* <button className="btn btn-primary mx-auto my-6 block px-10 py-2 md:w-max">
                        Print
                      </button> */}
                        {/* {CancelButton()} */}

                      </div>
                    </>
                }
              </div>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border bg-white">
            <div className="border-b p-4 text-lg font-medium">
              Payment Details
            </div>
            {
              orderInformationLoading ? <LoadingSkeleton /> :
                <>
                  <div className="space-y-3  p-4">
                    <div className="flex-col	">
                      <div className="text-dim">Payment Id:</div>
                      <div className="font-medium text-body">{orderInformation.paymentId[0] || "Not Applicable"}</div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dim">Payment Status:</span>
                      <span className="font-medium text-body">{getPaymentStatusFromStatusCode[orderInformation.paymentStatus]}</span>
                    </div>
                  </div>
                  {/* {PaymentButton()} */}

                </>
            }
          </div>
          {/* <div className="overflow-hidden rounded-xl border bg-white">
            <div className="border-b p-4 text-lg font-medium">
              Payment Details
            </div>
            <div className="space-y-3 p-4">
              <div className="flex justify-between">
                <span className="text-dim">Pay Mode:</span>
                <span className="font-medium text-body">Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dim">Amount:</span>
                <span className="font-medium text-body">$100.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dim">Transaction ID:</span>
                <span className="font-medium text-body">Not Available</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dim">Paid At:</span>
                <span className="font-medium text-body">
                  10:40 PM 04 Oct 2022
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dim">Status:</span>
                <span className="font-medium text-body">Paid</span>
              </div>
            </div>
          </div> */}
          <div className="overflow-hidden rounded-xl border bg-white">
            <div className="border-b p-4 text-lg font-medium">
              Refund Details
            </div>
            {
              orderInformationLoading ? <LoadingSkeleton /> :
                <div className="space-y-3 p-4">
                  <div className="flex justify-between">
                    <span className="text-dim">Payment Id:</span>
                    <span className="font-medium text-body">{orderInformation.paymentId[1] || "Not Applicable"}</span>
                  </div>
                  {/* <div className="flex justify-between">
                <span className="text-dim">Amount:</span>
                <span className="font-medium text-body">$100.00</span>
              </div> */}
                  {/* <div className="flex justify-between">
                <span className="text-dim">Transaction ID:</span>
                <span className="font-medium text-body">Not Available</span>
              </div> */}
                  {/* <div className="flex justify-between">
                <span className="text-dim">Refunded At:</span>
                <span className="font-medium text-body">Not Available</span>
              </div> */}
                  <div className="flex justify-between">
                    <span className="text-dim">Refund Amount:</span>
                    <span className="font-medium text-body">{orderInformation.refundAmount}</span>
                  </div>
                </div>

            }
          </div>
        </div>

      </div>
    </>
  );
}


function ItemCard({ itemData, itemAllData }) {

  return (
    <>
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
          <p>${(itemData.price).toFixed(2)}</p>
        </div>
        <div className="space-y-1 text-end">
          <p>Quantity</p>
          <p className="font-semibold text-primary">{itemAllData.qty}</p>
        </div>
      </div>
      <div className="px-4 flex flex-col">
        <p>Quantity Subtotal price</p>
        <p className="font-semibold text-primary">${(itemAllData.qty * itemData.price).toFixed(2)}</p>
      </div>
    </>
  );
}

Booking.getLayout = function getLayout(page) {
  return <UserDashboardLayout>{page}</UserDashboardLayout>;
};
