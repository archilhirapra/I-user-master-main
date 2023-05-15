import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

function Modal({ isOpen, onClose, children, className = "" }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className={`relative z-50 ${className}`}
        onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="md:ease-out md:duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="md:ease-in md:duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-gray-900 bg-opacity-80" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out"
              enterFrom="md:opacity-0 md:scale-95"
              enterTo="md:opacity-100 md:scale-100"
              leave="ease-in"
              leaveFrom="md:opacity-100 md:scale-100"
              leaveTo="md:opacity-0 md:scale-95">
              <Dialog.Panel className="absolute inset-0 w-full overflow-hidden bg-white md:relative md:max-w-4xl md:rounded-xl md:shadow-xl md:transition-all">
                {children}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-30 text-gray-400 hover:text-gray-900">
                  <XMarkIcon className="h-6 w-6 md:h-5 md:w-5" />
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Modal;
