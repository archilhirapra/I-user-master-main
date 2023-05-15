import React from "react";
import Link from "next/link";

import { getInitialsFromDate } from "src/helper/formatDate";
import { formatTime } from "src/helper/formatTime";
import { createdAtFromDate } from "src/helper/createdAtformatDate";

export const getTitleFromStatus = {
  0: "Created",
  1: "Payment Pending",
  2: "Booking Confirmed (PI)",
  3: "Pickup Initiated",
  4: "Pickup Failed",
  5: "Pickup Completed",
  6: "Processing",
  7: "Cleaning Completed",
  8: "Delivery Initiated",
  9: "Delivery Failed",
  10: "Order Completed (DC)",
  11: "Cancelled",
  12: "Refund Pending",
  13: "Refund Completed (OC)",
  default: "Not Available",
};

export const getClassNameFromStatus = {
  0: "bg-blue-100 text-blue-500",
  1: "bg-yellow-100 text-yellow-500",
  2: "bg-green-100 text-green-500",
  3: "bg-blue-100 text-blue-500",
  4: "bg-red-100 text-red-500",
  5: "bg-green-100 text-green-500",
  6: "bg-yellow-100 text-yellow-500",
  7: "bg-green-100 text-green-500",
  8: "bg-blue-100 text-blue-500",
  9: "bg-red-100 text-red-500",
  10: "bg-green-100 text-green-500",
  11: "bg-red-100 text-red-500",
  12: "bg-yellow-100 text-yellow-500",
  13: "bg-green-100 text-green-500",
  default: "bg-gray-100 text-gray-500",
};

function BookingCard({ pickupDate, deliveryDate, pickupTime, deliveryTime, status, id, createdAt, updatedAt }) {

  return (
    <Link href={`./bookings/${id}`}>
      <a className="rounded-xl border bg-white p-1">
        <div
          className={`rounded-t-lg p-3 text-center font-semibold ${getClassNameFromStatus[status] || getClassNameFromStatus["default"]}`}
        >
          {getTitleFromStatus[status] || getTitleFromStatus["default"]}
        </div>
        <div className="space-y-4 p-4">
          <div>
            <p className="font-medium">Order ID</p>
            <p className="text-sm text-dim">{id}</p>
          </div>
          <div>
            <p className="font-medium">Created At</p>
            <p className="text-sm text-dim">{createdAt}</p>
          </div>
          <div>
            <p className="font-medium">Updated At</p>
            <p className="text-sm text-dim">{updatedAt}</p>
          </div>
          <div>
            <p className="font-medium">Pickup Time Slot</p>
            <p className="text-sm text-dim">{getInitialsFromDate(pickupDate)} ({formatTime(pickupTime)})</p>
          </div>
          <div>
            <p className="font-medium">Delivery Time Slot</p>
            <p className="text-sm text-dim">{getInitialsFromDate(deliveryDate)} ({formatTime(deliveryTime)})</p>
          </div>
        </div>
      </a>
    </Link>
  );
}

export default BookingCard;
