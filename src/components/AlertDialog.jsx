import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RiCheckboxCircleFill, RiErrorWarningFill } from "react-icons/ri";

// type = "success" | "error" | "confirm"
export default function AlertDialog({
  onClose,
  isOpen,
  type = "confirm",
  title = "",
  content = "",
  onAccept,
}) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[5000]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg sm:p-6">
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
                    {type === "success" && (
                      <RiCheckboxCircleFill
                        size={48}
                        className="shrink-0 text-lime-500"
                      />
                    )}{" "}
                    {type === "error" && (
                      <RiErrorWarningFill
                        size={48}
                        className="shrink-0 text-red-500"
                      />
                    )}
                    <p className="text-sm text-gray-600">{content}</p>
                  </div>
                </div>
                <div className="mt-6 gap-4 sm:flex sm:flex-row-reverse">
                  <button onClick={onClose} type="button" className="btn-primary">
                    {type === "confirm" ? "Confirm" : "Okay"}
                  </button>
                  {type === "confirm" && (
                    <button
                      type="button"
                      className="btn-gray mt-4 sm:mt-0"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
