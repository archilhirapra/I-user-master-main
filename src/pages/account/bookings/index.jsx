import UserDashboardLayout from "../../../components/account/UserDashboardLayout";
import React from "react";
import BookingCard from "../../../components/account/BookingCard";
import TitleWithSummary from "../../../components/account/TitleWithSummary";
import { useEffect } from "react";
import axios from "axios";
import bookingConfigs from "src/configs/bookingConfigs";
import { useState } from "react";
import authConfig from "src/configs/auth";
import LoadingSpinner from "src/components/LoadingSpinner";
import LoadingSkeleton from "src/components/LoadingSkeleton";
//seo
import { BookingSeo } from ".././../../seo/seo";
export default function Bookings() {
  useEffect(() => {
    getOrderCount();
    getRecentBookings();
  }, []);

  const [recentBookings, setRecentBookings] = useState({
    isLoading: true,
    data: [],
  });

  const [orderCount, setOrderCount] = useState({
    isLoading: false,
    pending: null,
    completed: null,
  });

  const getRecentBookings = async () => {
    setRecentBookings((prev) => ({
      ...prev,
      isLoading: true,
    }));
    try {
      const response = await axios.get(bookingConfigs.getUserOrdersEndpoint, {
        headers: {
          Authorization:
            "Bearer " +
            window.localStorage.getItem(authConfig.storageTokenKeyName),
        },
      });

      setRecentBookings({
        isLoading: false,
        data: response.data.data.data,
      });
    } catch (error) {
      // console.log("error", error)
    }
    setRecentBookings((prev) => ({
      ...prev,
      isLoading: false,
    }));
  };

  const getOrderCount = async () => {
    setOrderCount({
      ...orderCount,
      isLoading: true,
    });
    try {
      const response = await axios.get(bookingConfigs.getOrdersCountEndpoint, {
        headers: {
          Authorization:
            "Bearer " +
            window.localStorage.getItem(authConfig.storageTokenKeyName),
        },
      });

      setOrderCount({
        isLoading: false,
        ...response.data.data.data,
      });
    } catch (error) { }
  };
  return (
    <>
      <BookingSeo />
      <TitleWithSummary
        title="Orders"
        summary="View and track your current and past orders, and view order status."
      />
      <p className="py-4 text-lg font-semibold">Summary</p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white px-5 py-4">
          {orderCount.isLoading ? (
            <LoadingSpinner position={"center"} />
          ) : (
            <>
              <p className="text-2xl font-semibold text-blue-500">
                {orderCount.pending && orderCount.pending}
              </p>
              <p className="mt-1 text-sm">Pending Orders</p>
            </>
          )}
        </div>
        <div className="rounded-lg border bg-white px-5 py-4">
          {orderCount.isLoading ? (
            <LoadingSpinner position={"center"} />
          ) : (
            <>
              <p className="text-2xl font-semibold text-blue-500">
                {orderCount.completed && orderCount.completed}
              </p>
              <p className="mt-1 text-sm">Completed Orders</p>
            </>
          )}
        </div>
        {/* <div className="rounded-lg border bg-white px-5 py-4">
          <p className="text-2xl font-semibold text-blue-500">$879</p>
          <p className="mt-1 text-sm">Pending Payment</p>
        </div> */}
        <a
          target="_blank"
          rel="noreferrer"
          href={`https://api.whatsapp.com/send/?phone=+19193086663&text=Hi, I am having trouble with my order. Can you please help me?&app_absent=0`}
          className="rounded-lg border bg-white px-5 py-4">
          <p className="text-2xl font-semibold text-blue-500">Help & Support?</p>
          <p className="mt-1 text-sm">We're here to help</p>
        </a>
      </div>
      <p className="mt-8 py-4 text-lg font-semibold">Recent orders</p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3">
        {recentBookings.isLoading ? (
          <>
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />

          </>
        ) : (
          !!recentBookings.data.length &&
          recentBookings.data.map((booking, index) => {
            return (
              <BookingCard
                key={index}
                id={booking.id}
                status={booking.status}
                deliveryDate={booking.deliveryDate}
                pickupDate={booking.pickupDate}
                deliveryTime={booking.deliveryTime}
                pickupTime={booking.pickupTime}
                createdAt={booking.createdAt}
                updatedAt={booking.updatedAt}
              />
            );
          })
        )}
      </div>
      {recentBookings.isLoading ? (
        <></>
      ) : (
        !recentBookings.data.length && (
          <div className="mt-9 grid place-items-center text-dark">
            {/* <h1 className="text-center text-lg text-dark">
            No booking found.
          </h1> */}
            <h3 className="mt-6 text-3xl text-dim ">No Orders Found !!</h3>
          </div>
        )
      )}

      {/*  show this if no data*/}
      {/*<div className="flex items-center justify-center rounded-lg bg-gray-100 p-10 shadow-inner">*/}
      {/*  <p className="text-center font-bold text-gray-500/50">*/}
      {/*    No Bookings <br /> Available*/}
      {/*  </p>*/}
      {/*</div>*/}
    </>
  );
}

Bookings.getLayout = function getLayout(page) {
  return <UserDashboardLayout>{page}</UserDashboardLayout>;
};
