import React, { useContext, useState } from "react";
import Input from "../Input";
import AuthPageArtwork from "./AuthPageArtwork";
import { AuthPageContext } from "../../context/AuthPageContext";
import Otp from "./OTP";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "src/hooks/useAuth";
import LoadingSpinnerWithText from "../LoadingSpinnerWithText";

export default function ForgotPassword() {
  const [resetLoading, setResetLoading] = useState(false)
  const [page, setPage] = useContext(AuthPageContext);
  // ** Hook
  const auth = useAuth();


  // ** States
  const [step, setStep] = useState(1);


  //**Form validation */
  const schema = yup.object().shape({
    id: yup.string().email().required("Email is a required field"),
    password: yup
      .string()
      .min(5, "Confirm password must be at least 5 characters")
      .required("Password is a required field"),
    confirm_password: yup
      .string()
      .min(5, "Confirm password must be at least 5 characters")
      .required("Confirm Password is a required field")
      .oneOf([yup.ref("password")], "Password does not match"),
  });

  const defaultValues = {
    id: '',
    password: '',
    confirm_password: '',
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




  const [typedId, setTypedId] = useState(null);
  const [typedConfirmPassword, setTypedConfirmPassword] = useState(null);
  const handleForgotPassword = (data) => {
    setResetLoading(true)
    const { id, password, confirm_password } = data;
    // let id = email
    auth.forgotPassword({ id }, (data) => {
      setResetLoading(false)
      if (data.message == "success") {
        setTypedId(id);
        setTypedConfirmPassword(confirm_password);
        setStep(2);
      } else {
        if (data.message == "failed") {
          setError("id", {
            // type: 'manual',
            message: data.data.data.message,
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







  return (
    <div className="p-6">
      <>
        {step === 1 && (
          <>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Forgot Password</h2>
              <p className="text-sm text-dark/80">
                Reset your password and regain access to your account.
              </p>
            </div>
            <div className="mt-8 gap-6 md:mt-12 md:flex">
              <div className="space-y-4 md:w-4/12 md:min-w-[300px]">
                {/*conditionally render this element*/}
                {/* <p className="text-sm text-red-500">Some error message goes here</p> */}
                {errors.different && (
                  <p className="text-sm text-red-500">{errors.id.different}</p>
                )}


                <Controller
                  name="id"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <Input
                      disabled={resetLoading}
                      autoFocus
                      label="Email ID"
                      value={value}
                      // onBlur={onBlur}
                      onChange={onChange}
                    // error={Boolean(errors.id)}
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
                      disabled={resetLoading}
                      value={value}
                      onBlur={onBlur}
                      label="New Password"
                      onChange={onChange}
                      id="auth-login-v2-password"
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
                      disabled={resetLoading}
                      value={value}
                      onBlur={onBlur}
                      label="Confirm Password"
                      onChange={onChange}
                      id="forgot-confirm-password"
                      // error={Boolean(errors.password)}
                      type="password"
                    />
                  )}
                />
                {/* <Input label="Confirm Password"
                    id="confirm_password"
                    name="CPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  /> */}
                {errors.confirm_password && (
                  <p style={{ marginTop: 0 }} className="text-sm text-red-500">
                    {errors.confirm_password.message}
                  </p>
                )}

                {/*make it disabled conditionally*/}
                <button
                  disabled={resetLoading}
                  onClick={handleSubmit(handleForgotPassword)}
                  type="submit"
                  className="btn-primary">
                  {resetLoading ? (
                    <LoadingSpinnerWithText text={'Reset Password'} position={'center'} />
                  ) : ('Reset Password')}
                </button>

                <p className="text-center">
                  {"Already have an account? "}
                  <button
                    onClick={() => setPage("login")}
                    className="font-semibold text-blue-600"
                  >
                    Login
                  </button>
                </p>
              </div>
              <AuthPageArtwork />
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <Otp
              phone={typedId}
              from={"forgot"}
              password={typedConfirmPassword}
              onBack={() => setStep(1)}
            />
          </>
        )}
      </>




    </div>
  );
}
