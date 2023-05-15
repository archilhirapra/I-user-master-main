import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function Accordion({ title = "", classNames = "", children }) {
  const [expanded, setExpanded] = useState(true);
  const toggleExpand = () => {
    setExpanded((old) => !old);
  };
  return (
    <div className={classNames}>
      <div
        onClick={toggleExpand}
        className="flex cursor-pointer items-center justify-between p-4 hover:bg-gray-50/80"
      >
        <div className="text-base font-medium">{title}</div>
        <button>
          <ChevronDownIcon
            className={`h-4 w-4 stroke-2 ${expanded ? "rotate-180" : "rotate-0"
              } transition-transform`}
          />
        </button>
      </div>
      {expanded && <div className="bg-white">{children}</div>}
    </div>
  );
}
