import React, { useEffect, useState } from "react";
import UserDashboardLayout from "../../components/account/UserDashboardLayout";
import Accordion from "../../components/account/Accordion";
import { RiCalendarFill } from "react-icons/ri";
import LoadingSkeleton from "src/components/LoadingSkeleton";

import { useAuth } from "src/hooks/useAuth";
import { useRouter } from "next/router";
//seo
import { SubscriptionSeo } from "../../seo/seo";
function Subscriptions() {
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



  const padTo2Digits = (num) => {
    return num.toString().padStart(2, '0');
  }

  const dateFormat = (date) => {
    return (
      [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
      ].join('/') +
      ' ' +
      [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }


  const getPlanStatusFromStatusCode = {
    0: "Pending",
    1: "Paid/Active",
    2: "expired",
    3: "Payment failed",
    4: "Used",
  }
  const getMembershipStatusFromStatusCode = {
    0: "Pending",
    1: "Paid",
    2: "expired",
    3: "Payment failed",
  }

  // const memberhipButton=()=>{
  //   switch (status) {
  //     case 2:

  //       break;

  //     default:
  //       break;
  //   }
  // }






  return (
    <>
      <SubscriptionSeo />
      <div className="mt-4  grid grid-cols-1 md:grid-cols-2 gap-1 max-w-screen-md">
        {/* Single Card Starts */}
        {membershipDetail && (
          <div className="overflow-hidden w-96 rounded-xl border bg-white">
            <div className="border-b p-4 text-lg font-medium">
              Membership Details
            </div>
            {
              false ? <LoadingSkeleton /> :
                <>
                  <div className="space-y-3 p-4">
                    <div className="flex justify-between">
                      <span className="text-dim">Membership Id:</span>
                      <span className="font-medium text-body">{membershipDetail?._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dim">Payment Id:</span>
                      <span className="font-medium text-body">{membershipDetail?.paymentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dim">Start Date:</span>
                      <span className="font-medium text-body">{dateFormat(new Date(membershipDetail?.startDate))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dim">End Date:</span>
                      <span className="font-medium text-body">{dateFormat(new Date(membershipDetail?.endDate))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dim">Pending Days:</span>
                      <span className="font-medium text-body">{membershipDetail?.pendingDays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dim">Used Days:</span>
                      <span className="font-medium text-body">{membershipDetail?.usedDays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dim">Renew Price:</span>
                      <span className="font-medium text-body">${membershipDetail?.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dim">Status:</span>
                      <span className="font-medium text-body">{getPlanStatusFromStatusCode[membershipDetail?.status]}</span>
                    </div>
                  </div>
                  <div className="px-4">
                    {(membershipDetail?.isRenew) ? (
                      <>
                        <button onClick={() => router.push('/subscription')} className="btn btn-primary mx-auto my-6 block px-20 py-2 md:w-max">
                          Renew
                        </button>
                      </>
                    ) : (
                      <>
                      </>
                    )
                    }

                  </div>
                </>
            }
          </div>
        )}

        {subscriptionDetail && (
          <div className="overflow-hidden w-96 rounded-xl border bg-white">
            <div className="border-b p-4 text-lg font-medium">
              Subscription Details
            </div>
            {
              false ? <LoadingSkeleton /> :
                <>
                  <div className="space-y-3 p-4">
                    <div className="flex justify-between">
                      <span className="text-dim">Subscription Id:</span>
                      <span className="font-medium text-body">{subscriptionDetail?._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dim">Payment Id:</span>
                      <span className="font-medium text-body">{subscriptionDetail?.paymentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dim">Start Date:</span>
                      <span className="font-medium text-body">{dateFormat(new Date(subscriptionDetail?.startDate))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dim">End Date:</span>
                      <span className="font-medium text-body">{dateFormat(new Date(subscriptionDetail?.endDate))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dim">Pending Days:</span>
                      <span className="font-medium text-body">{subscriptionDetail?.pendingDays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dim">Used Days:</span>
                      <span className="font-medium text-body">{subscriptionDetail?.usedDays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dim">Total Pickup:</span>
                      <span className="font-medium text-body">{subscriptionDetail?.subscriptionData?.[0].pickup}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dim">Pending Pickup:</span>
                      <span className="font-medium text-body">{subscriptionDetail?.pickup}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dim">Total Delivery:</span>
                      <span className="font-medium text-body">{subscriptionDetail?.subscriptionData?.[0].delivery}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dim">Pending Delivery:</span>
                      <span className="font-medium text-body">{subscriptionDetail?.delivery}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dim">Renew Price:</span>
                      <span className="font-medium text-body">${subscriptionDetail?.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dim">Status:</span>
                      <span className="font-medium text-body">{getMembershipStatusFromStatusCode[subscriptionDetail?.status]}</span>
                    </div>
                  </div>
                  <div className="px-4">
                    {(subscriptionDetail?.isRenew) ? (
                      <>
                        <button onClick={() => router.push('/subscription')} className="btn btn-primary mx-auto my-6 block px-20 py-2 md:w-max">
                          Renew
                        </button>
                      </>
                    ) : (
                      <>
                      </>
                    )
                    }
                  </div>
                </>
            }
          </div>
        )}

      </div>

      {!membershipDetail && (!subscriptionDetail && (
        <div className="grid mt-9 place-items-center text-dark">
          <h3 className="text-3xl md:mt-48 text-dim ">
            <button onClick={() => router.push('/subscription')} className="mt-4 w-full rounded-lg bg-[#FFA700] p-3 text-sm font-semibold text-white hover:bg-[#FFA700]/80">
              {/* <button onClick={() => router.push('/subscription')} > */}
              {'Buy Subscription Plan'}
            </button>
          </h3>

        </div>
      ))}

    </>
  );
}

Subscriptions.getLayout = function getLayout(page) {
  return <UserDashboardLayout>{page}</UserDashboardLayout>;
};

export default Subscriptions;
