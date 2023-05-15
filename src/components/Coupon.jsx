import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { createdAtFromDate } from "src/helper/createdAtformatDate";


export default function CouponCard({ coupon, onApplyCouponBtnClick }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-lg bg-gray-50 shadow-lg shadow-gray-200/40">
      <div className="flex h-40 overflow-hidden rounded-lg bg-white">
        <div className="overflow-hiddden relative w-16 shrink-0 border-r-2 border-dashed border-white bg-gradient-to-b from-[#548EFF] to-[#185ADB]">
          <div className="absolute left-16 bottom-0 flex h-16 w-40 origin-bottom-left -rotate-90 items-center justify-center whitespace-nowrap text-lg font-semibold text-white">
            {
              (coupon?.percentage ? (<>{coupon?.discount}% OFF</>) : (<>${coupon?.discount} OFF</>))
            }
            {/* 20% OFF */}
          </div>
          <div className="absolute left-0 top-1/2 w-5 -translate-x-3 -translate-y-1/2 space-y-4">
            <div className="h-5 w-5 rounded-full bg-gray-100" />
            <div className="h-5 w-5 rounded-full bg-gray-100" />
            <div className="h-5 w-5 rounded-full bg-gray-100" />
          </div>
        </div>
        <div className="flex h-full grow flex-col rounded-r-lg border-dashed border-gray-200 p-4">
          <div className="text-lg font-semibold text-[#147E1E]">{coupon?.name}</div>
          <p className="text-sm text-[#0A1931]/70 line-clamp-2">
            {coupon?.description}
          </p>
          <div className="mt-auto flex justify-between gap-4">
            <div>
              <div className="font-medium">Expires</div>
              {/* <div className="text-sm font-medium">30 Jul 2020</div> */}
              <div className="text-sm font-medium">{createdAtFromDate(coupon.end)}</div>
            </div>
            <button onClick={()=>onApplyCouponBtnClick(coupon.name)} className="rounded-full bg-[#F57600] px-8 py-2 text-base font-semibold text-white">
              Apply
            </button>
          </div>
        </div>
      </div>
      <div className="p-3">
        <button
          onClick={() => setExpanded((old) => !old)}
          className="flex w-full items-center justify-between gap-4 font-medium">
          <span>Terms and condition apply</span>
          <ChevronDownIcon className="h-4 w-4 stroke-2" />
        </button>
        {expanded && (
          <div className="mt-2 border-t pt-2 text-sm">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Praesentium corporis maxime error libero officiis consequatur illo?
            Molestias rerum nesciunt atque, eveniet maiores, ab ipsa impedit
            fugit unde voluptates accusamus vel?
          </div>
        )}
      </div>
    </div>
  );
}
