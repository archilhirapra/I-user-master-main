import { ArrowSmallLeftIcon } from "@heroicons/react/24/outline";
import AuthPageArtwork from "./AuthPageArtwork";
import { useEffect, useState } from "react";
import { useAuth } from "src/hooks/useAuth";
import { formatOtp, formatPhoneNumber } from "src/helper/helper";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LoadingSpinnerWithText from "../LoadingSpinnerWithText";


function Otp({ phone, from, password, onBack }) {
  const [otpLoading, setOtpLoading] = useState(false)

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
  const handleResendCode = () => {
    setOtpLoading(true)
    let id = phone;
    auth.resendOtp({ id }, (data) => {
      setOtpLoading(false)
      if (data.message == "success") {
        setCooldown(30);
        clearErrors('otp');
        // setOtpCodeInput("");
      } else {
        if (data.message == "failed") {
          setError("otp", {
            // type: 'manual',
            message: data.error.message,
          });
        } else {
          setError("otp", {
            // type: 'manual',
            message: data.error,
          });
        }
      }
    });
  };

  const handleVerifyOtp = () => {
    if (from == "forgot") {
      handleVerifyOtpForgot();
    } else if (from == "emailLogin") {
      handleVerifyEmailLogin();
    } else if (from == "mobileLogin") {
      handleVerifyMobileLogin();
    } else if (from == "emailRegister") {
      handlevarifyEmailRegister();
    } else if (from == "phoneRegister") {
      handlevarifyPhoneRegister();
    }
  };

  const handleVerifyEmailLogin = () => {
    setOtpLoading(true)
    let id = phone;
    if (otpCodeInput != "") {
      let otp = otpCodeInput.replace(/\s/g, "");
      auth.verifyOtp({ id, otp }, (data) => {
        setOtpLoading(false)
        if (data.message == "failed") {
          setError("otp", {
            // type: 'manual',
            message: data.error.message,
          });
        } else {
          setError("otp", {
            // type: 'manual',
            message: data.error,
          });
        }
      });
    } else {
      setError("otp", {
        // type: 'manual',
        message: "please Enter otp",
      });

    }
  };

  const handleVerifyMobileLogin = () => {
    setOtpLoading(true)
    let id = phone;
    if (otpCodeInput != "") {
      let otp = otpCodeInput.replace(/\s/g, "");
      auth.verifyOtp({ id, otp }, (data) => {
        setOtpLoading(false)
        if (data.message == "failed") {
          setError("otp", {
            // type: 'manual',
            message: data.error.message,
          });
        } else {
          setError("otp", {
            // type: 'manual',
            message: data.error,
          });
        }
      });
    } else {
      setError("otp", {
        // type: 'manual',
        message: "please Enter otp",
      });
    }
  };
  const handlevarifyEmailRegister = () => {
    setOtpLoading(true)
    let id = phone;
    if (otpCodeInput != "") {
      let otp = otpCodeInput.replace(/\s/g, "");
      auth.verifyOtp({ id, otp }, (data) => {
        setOtpLoading(false)
        if (data.message == "failed") {
          setError("otp", {
            // type: 'manual',
            message: data.error.message,
          });
        } else {
          setError("otp", {
            // type: 'manual',
            message: data.error,
          });
        }
      });
    } else {
      setError("otp", {
        // type: 'manual',
        message: "please Enter otp",
      });
    }
  };
  const handlevarifyPhoneRegister = () => {
    setOtpLoading(true)
    let id = phone;
    if (otpCodeInput != "") {
      let otp = otpCodeInput.replace(/\s/g, "");
      auth.verifyOtp({ id, otp }, (data) => {
        setOtpLoading(false)
        if (data.message == "failed") {
          setError("otp", {
            // type: 'manual',
            message: data.error.message,
          });
        } else {
          setError("otp", {
            // type: 'manual',
            message: data.error,
          });
        }
      });
    } else {
      setError("otp", {
        // type: 'manual',
        message: "please Enter otp",
      });
    }
  };

  const handleVerifyOtpForgot = () => {
    setOtpLoading(true)
    let id = phone;
    if (otpCodeInput != "") {
      let otp = otpCodeInput.replace(/\s/g, "");

      auth.verifyOtpforgotPassword({ id, otp, password }, (data) => {
        setOtpLoading(false)
        if (data.message == "success") {
          setError("otp", {
            // type: 'manual',
            message: data.error.message,
          });
        } else if (data.message == "failed") {
          setError("otp", {
            // type: 'manual',
            message: data.error.message,
          });
        } else {
          setError("otp", {
            // type: 'manual',
            message: data.error,
          });
        }
      });
    } else {
      setError("otp", {
        // type: 'manual',
        message: "please Enter otp",
      });
    }
  };

  return (
    <>
      <div className="items-start md:flex">
        <button
          onClick={onBack}
          className="mr-4 rounded-full bg-white p-1 hover:bg-gray-100"
        >
          <ArrowSmallLeftIcon className="h-7 w-7 shrink-0 stroke-2" />
        </button>
        <div className="mt-2 space-y-1 md:mt-0">
          <h2 className="text-xl font-semibold">One Time Password (OTP)</h2>
          <p className="text-sm text-dark/80">Code has been sent to {phone}</p>
        </div>
      </div>
      <div className="mt-8 gap-6 md:mt-12 md:flex">
        <from>


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
                      disabled={otpLoading}

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




                {/* <input
                type="text"
                id="phone"
                placeholder="Enter Code"
                className="ml-2 w-full bg-transparent p-2 outline-none"
                value={otpCodeInput}
                onChange={otpChange}
              /> */}

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
              disabled={otpLoading}
              // type="submit"
              onClick={handleSubmit(handleVerifyOtp)}
              // disabled={cooldown > 0 ? "" : "disabled"}
              className="btn-primary">
              {otpLoading ? (
                <LoadingSpinnerWithText text={'Verify'} position={'center'} />
              ) : 'Verify'}
              {/* Verify */}
            </button>
          </div>
        </from>
        <AuthPageArtwork />
      </div>
    </>
  );
}

export default Otp;
