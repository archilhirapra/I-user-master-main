import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/solid";

function SlideOver({ isOpen, onClose, children, title = "" }) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[1000]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-40">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative flex h-full max-h-screen max-w-md flex-col overflow-auto bg-white">
              <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b bg-gray-100 p-4">
                <h1 className="text-lg font-bold">{title}</h1>
                <button
                  onClick={onClose}
                  className="ml-auto text-gray-500 hover:text-dark"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="shrink-0 overflow-hidden px-4 py-5">
                {children}
              </div>
            </Dialog.Panel>
          </Transition.Child>
          <div className="w-14 flex-shrink-0" aria-hidden="true"></div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default SlideOver;
