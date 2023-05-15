import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { RiCheckboxCircleFill, RiErrorWarningFill } from "react-icons/ri";

import { ArrowSmallLeftIcon } from "@heroicons/react/24/outline";
// import AuthPageArtwork from "./AuthPageArtwork";
import { useEffect, useState } from "react";
import { useAuth } from "src/hooks/useAuth";
import { deformatPhoneNumber, formatOtp, formatPhoneNumber } from "src/helper/helper";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import axios from 'axios'
// ** Config
import authConfig from "src/configs/auth";
import myDetailsConfig from "src/configs/myDetails";
import { useRouter } from "next/router";



// type = "success" | "error" | "confirm"
export default function OtpDialog({
  to,
  onClose,
  isOpen,
  formData,
  continueEditing,
  from
}) {


  const router = useRouter();
  // ** Hook
  const auth = useAuth();

  const [cooldown, setCooldown] = useState(30);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (cooldown <= 0) return;
      setCooldown((old) => old - 1);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [cooldown]);



  // const [errors, setError] = useState({});
  const [otpCodeInput, setOtpCodeInput] = useState("");
  const schema = yup.object().shape({
    otp: yup
      .string()
      .required("Otp is a required field")
      .min(7, "min 6 digit"),
  });
  const defaultValues = {
    otp: '',
  }



  const {
    watch,
    register,
    reset,
    control,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const otpChange = (e) => {
    clearErrors('otp');
    setOtpCodeInput((e));
  };
  const handleResendCode = (e) => {
    e.preventDefault();

    if (from = 'details') {
      // resendOtpUsingIdEndpoint
      let id = to;
      // detailC

      const storedToken =
        "Bearer " + window.localStorage.getItem(authConfig.storageTokenKeyName);
      try {
        axios.post(myDetailsConfig.resendOtpUsingIdEndpoint, {}, {
          headers: {
            Authorization: storedToken,
          },
        })
          .then(async (res) => {
            setCooldown(30);
            clearErrors('otp');
            setOtpCodeInput("");
          })
      } catch (e) {
        setError("otp", {
          message: 'Some thing went wrong!!',
        });
      }

    } else {
      let id = to;
      auth.resendOtp({ id }, (data) => {
        if (data.message == "success") {
          setCooldown(30);
          clearErrors('otp');
          setOtpCodeInput("");
        } else {
          if (data.message == "failed") {
            setError("otp", {
              message: data.error.message,
            });
          } else {
            setError("otp", {
              message: data.error,
            });
          }
        }
      });
    }




  };

  const handleVerifyOtp = () => {
    if (otpCodeInput != "") {
      let otp = otpCodeInput.replace(/\s/g, "");
      continueEditing(otp)
    } else {
      setError("otp", {
        // type: 'manual',
        message: "please Enter otp",
      });

    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[5000]" onClose={() => { reset(); onClose() }}>
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
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-sm sm:p-6">
                <div className="items-start md:flex">
                  <button
                    onClick={onClose}
                    className="mr-4 rounded-full bg-white p-1 hover:bg-gray-100"
                  >
                    <ArrowSmallLeftIcon className="h-7 w-7 shrink-0 stroke-2" />
                  </button>
                  <div className="mt-2 space-y-1 md:mt-0">
                    <h2 className="text-xl font-semibold">One Time Password (OTP)</h2>
                    {from=='details'?(<><p className="text-sm text-dark/80">Code has been sent </p></>):(<><p className="text-sm text-dark/80">Code has been sent to {to}</p></>)}
                    
                  </div>
                </div>
                <div className=" gap-6  md:flex">
                  <form>
                    <div className="space-y-4 md:w-4/12 md:min-w-[300px]">
                      {/*conditionally render this element*/}
                      {/*<p className="text-sm text-red-500">Some error message goes here</p>*/}
                      <div>
                        <label className="label" htmlFor="phone">
                          {/* Mobile Number */}
                        </label>
                        <div className="input relative mt-1 flex p-1">
                          <div className="flex shrink-0 justify-center border-r py-2 px-4 font-semibold">
                            DC
                          </div>

                          <Controller
                            name="otp"
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange, onBlur } }) => (
                              <input

                                type="text"
                                id="phone"
                                placeholder="Enter Code"
                                className="ml-2 w-full bg-transparent p-2 outline-none"
                                value={value}

                                onChange={(e) => {
                                  clearErrors('otp');
                                  otpChange(formatOtp(e.target.value))
                                  onChange(formatOtp(e.target.value))
                                }}


                              />
                            )}
                          />
                        </div>
                        {errors.otp && (
                          <p style={{ marginTop: 0 }} className="text-sm text-red-500">
                            {errors.otp.message}
                          </p>
                        )}
                      </div>
                      <div>
                        {cooldown > 0 ? (
                          <p className="text-sm font-medium text-gray-400">
                            Your code will expire in {cooldown} sec.
                          </p>
                        ) : (
                          <div>
                            <span>{"Didn't receive the code? "}</span>
                            <button onClick={handleResendCode} className="text-blue-600">
                              Resend OTP
                            </button>
                          </div>
                        )}
                      </div>

                      {/*make it disabled conditionally*/}
                      <button
                        // type="submit"
                        onClick={handleSubmit(handleVerifyOtp)}
                        // disabled={cooldown > 0 ? "" : "disabled"}
                        className="btn-primary">
                        Verify
                      </button>
                    </div>
                  </form>
                  {/* <AuthPageArtwork /> */}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
