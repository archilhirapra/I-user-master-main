import React, { useContext, useState } from "react";
import Input from "../Input";
import AuthPageArtwork from "./AuthPageArtwork";
import { AuthPageContext } from "../../context/AuthPageContext";
import { useAuth } from "src/hooks/useAuth";
import Otp from "./OTP";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LoadingSpinnerWithText from "../LoadingSpinnerWithText";



import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { ourGoogleAuth } from "src/firebase";

export default function Register() {
  const googleAuth = new GoogleAuthProvider();

  const [registerLoading, setRegisterLoading] = useState(false)

  const [page, setPage] = useContext(AuthPageContext);
  // ** Hook
  const auth = useAuth();

  const schema = yup.object().shape({
    id: yup.string().email().required("Email is a required field"),
    password: yup.string().min(5).required("Password is a required field"),
    confirm_password: yup
      .string()
      .min(5)
      .required("Confirm Password is a required field")
      .oneOf([yup.ref("password")], "Password does not match"),
  });

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const [step, setStep] = useState(1);
  const [typedEmail, setTypedEmail] = useState(null);

  const handleRegister = (data) => {
    setRegisterLoading(true)
    const { id, confirm_password, referralCode } = data;
    let email = id;
    let password = confirm_password;
    auth.registerByEmail({ email, password, referralCode }, (data) => {
      setRegisterLoading(false)
      if (data.message == "success") {
        // setTypedId(id);
        setTypedEmail(id);
        // setTypedConfirmPassword(confirm_password)
        setStep(2);
      } else {
        if (data.message == "failed") {
          setError("id", {
            // type: 'manual',
            message: data.error.message,
          });
        } else {
          setError("id", {
            // type: 'manual',
            message: data.error,
          });
        }
      }
    });
  };






  const loginWithGoogle = async () => {
    const result = await signInWithPopup(ourGoogleAuth, googleAuth);
    auth.googleLogin({ idToken: result?.user?.accessToken }, (data) => {
      // console.log(data)
      // console.log(data.response.data)
      if (data.message == "failed") {
        // console.log()
        // setError("otp", {
        //   // type: 'manual',
        //   message: data.error.message,
        // });
      } else {
        // setError("otp", {
        //   // type: 'manual',
        //   message: data.error,
        // });
      }
    });

  }

  return (
    <div className="p-6">
      <>
        {step === 1 && (
          <>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Create your account</h2>
              <p className="text-sm text-dark/80">
                Sign up for easy access to your order history and personal information.
              </p>
            </div>
            <div className="mt-8 gap-6 md:mt-12 md:flex">
              <div className="space-y-4 md:w-4/12 md:min-w-[300px]">
                {/*conditionally render this element*/}

                {errors.different && (
                  <p className="text-sm text-red-500">
                    {errors.different.message}
                  </p>
                )}

                {/* <Input label="Email ID" id="email" name="Email" type="text" /> */}
                <Controller
                  name="id"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <Input
                      disabled={registerLoading}
                      value={value}
                      // onBlur={onBlur}
                      label="Email ID"
                      onChange={onChange}
                      id="id"
                      // error={Boolean(errors.password)}
                      type="text"
                    />
                  )}
                />
                {errors.id && (
                  <p style={{ marginTop: 0 }} className="text-sm text-red-500">
                    {errors.id.message}
                  </p>
                )}
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <Input
                      disabled={registerLoading}
                      value={value}
                      onBlur={onBlur}
                      label="Password"
                      onChange={onChange}
                      id="password"
                      // error={Boolean(errors.password)}
                      type="password"
                    />
                  )}
                />
                {errors.password && (
                  <p style={{ marginTop: 0 }} className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
                <Controller
                  name="confirm_password"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <Input
                      disabled={registerLoading}
                      value={value}
                      onBlur={onBlur}
                      label="Confirm Password"
                      onChange={onChange}
                      id="confirm_password"
                      // error={Boolean(errors.password)}
                      type="password"
                    />
                  )}
                />
                {errors.confirm_password && (
                  <p style={{ marginTop: 0 }} className="text-sm text-red-500">
                    {errors.confirm_password.message}
                  </p>
                )}



                <Controller
                  name="referralCode"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <Input
                      disabled={registerLoading}
                      value={value}
                      // onBlur={onBlur}
                      label="Referral Code"
                      onChange={onChange}
                      id="referralCode"
                      // error={Boolean(errors.password)}
                      type="text"
                    />
                  )}
                />
                {/* {errors.referralCode && (
                  <p style={{ marginTop: 0 }} className="text-sm text-red-500">
                    {errors.referralCode.message}
                  </p>
                )} */}






                {/*make it disabled conditionally*/}
                <button
                  disabled={registerLoading}
                  onClick={handleSubmit(handleRegister)}
                  className="btn-primary">
                  {registerLoading ? (
                    <LoadingSpinnerWithText text={'Register'} position={'center'} />
                  ) : 'Register'}
                </button>
                <div className="space-y-4 text-center">
                  <div className="separator">or continue with</div>
                  <div className="flex items-stretch justify-center space-x-3">
                    <button onClick={loginWithGoogle} className="w-20 rounded-lg border py-3 px-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto w-6"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
                        />
                        <path
                          fill="#34A853"
                          d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24Z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09Z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96Z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setPage("register-mobile")}
                      className="w-max rounded-lg border py-3 px-6 text-center font-semibold uppercase"
                    >
                      OTP
                    </button>
                  </div>
                  <p>
                    {"Already have an account? "}
                    <button
                      onClick={() => setPage("login")}
                      className="font-semibold text-blue-600"
                    >
                      Login
                    </button>
                  </p>
                </div>
              </div>
              <AuthPageArtwork />
            </div>
          </>
        )}
        {step === 2 && (
          <Otp
            phone={typedEmail}
            from={"emailRegister"}
            onBack={() => setStep(1)}
          />
        )}
      </>

    </div>
  );
}
