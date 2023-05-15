import React, { useContext, useState } from "react";
import Input from "../Input";
import AuthPageArtwork from "./AuthPageArtwork";
import { AuthPageContext } from "../../context/AuthPageContext";
import { useRouter } from "next/router";
import { useAuth } from "src/hooks/useAuth";
import Otp from "./OTP";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// import GoogleLogin from 'react-google-login';
import { useEffect } from "react";
import axios from "axios";
// import { gapi } from "gapi-script";


import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { ourGoogleAuth } from "src/firebase";
import LoadingSpinner from "../LoadingSpinner";
import { LoadingButton } from "../LoadingButton";
import LoadingSpinnerWithText from "../LoadingSpinnerWithText";


export default function Login() {
  const googleAuth = new GoogleAuthProvider();

  const [loginLoading, setLoginLoading] = useState(false)

  // useEffect(() => {
  //   const gapi = import("gapi-script").then((pack) => pack.gapi);
  //   const initClient = async () => {
  //     const d = await gapi;
  //     d.client.init({
  //       clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  //       scope: "email",
  //       plugin_name: "chat",
  //     });
  //   };
  //   gapi.then((d) => d.load("client:auth2", initClient));
  // }, []);



  const [page, setPage] = useContext(AuthPageContext);
  const router = useRouter();

  // ** Hook
  const auth = useAuth();

  // ** States
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();



  //**Form validation */

  const schema = yup.object().shape({
    id: yup.string().email().required("Email is a required field"),
    password: yup.string().min(5).required("Password is a required field"),
  });
  const defaultValues = {
    // id: 'roshan@gmail.com',
    // password: 'password',
    id: '',
    password: '',
  }

  const {
    watch,
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const handleLogin = (data) => {
    setLoginLoading(true)
    const { id, password } = data;
    // let id = email;
    auth.loginInit({ id, password }, (data) => {
      setLoginLoading(false)
      if (data.message === "success") {
        setEmail(id);
        setStep(2);
      } else {
        if (data.message === "failed") {
          if (data.type === 1) {
            setError("password", {
              // type: 'manual',
              message: data.error.message,
            });
          } else {
            setError("id", {
              // type: 'manual',
              message: data.error.message,
            });
          }
        } else {
          setError("different", {
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
              <h2 className="text-xl font-semibold">
                Login in to your account
              </h2>
              <p className="text-sm text-dark/80">
                Log in to view your personal information and order history
              </p>
            </div>
            <div className="mt-8 gap-6 md:mt-12 md:flex">
              <div className="space-y-4 md:w-4/12 md:min-w-[300px] md:px-2">
                {/*conditionally render this element*/}
                {/* <p className="text-sm text-red-500">Some error message goes here</p> */}
                {errors.different && (
                  <p className="text-sm text-red-500">
                    {errors.different.message}
                  </p>
                )}
                <Controller

                  name="id"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <Input
                      disabled={loginLoading}
                      value={value}
                      onChange={onChange}
                      label="Email ID"
                      id="email"
                      type="text"
                    // error={Boolean(errors.password)}
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
                      disabled={loginLoading}
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

                {/*make it disabled conditionally*/}
                <button
                  disabled={loginLoading}
                  onClick={handleSubmit(handleLogin)}
                  className="btn-primary"
                >
                  {
                    loginLoading ? (
                      <LoadingSpinnerWithText text={'Login'} position={'center'} />
                    ) : (
                      'Login'
                    )
                  }

                </button>
                <div className="space-y-4 text-center">
                  <button
                    onClick={() => setPage("forgot-password")}
                    className="font-semibold text-dark/70 underline"
                  >
                    Forgot Password?
                  </button>
                  <div className="separator">or continue with</div>
                  <div className="flex items-stretch justify-center space-x-3">
                    {/* <GoogleLogin
                      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                      render={renderProps => (
                        <button
                          onClick={renderProps.onClick}
                          disabled={renderProps.disabled}
                          className="w-20 rounded-lg border py-3 px-6">
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
                      )}
                      buttonText="Login"
                      onSuccess={responseGoogleSuccess}
                      onFailure={responseGoogleFailure}
                      cookiePolicy={'single_host_origin'}
                    /> */}

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
                      onClick={() => setPage("login-mobile")}
                      className="w-max rounded-lg border py-3 px-6 text-center font-semibold uppercase"
                    >
                      OTP
                    </button>
                  </div>
                  <p>
                    {"Don't have an account? "}
                    <button
                      onClick={() => setPage("register")}
                      className="font-semibold text-blue-600"
                    >
                      Register
                    </button>
                  </p>
                </div>
              </div>
              <AuthPageArtwork />
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <Otp phone={email} from={"emailLogin"} onBack={() => setStep(1)} />
          </>
        )}
      </>

    </div>
  );
}
