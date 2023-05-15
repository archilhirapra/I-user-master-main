import Input from "../../components/Input";
import UserDashboardLayout from "../../components/account/UserDashboardLayout";
import TitleWithSummary from "../../components/account/TitleWithSummary";
import React, { useState } from "react";




// ** Config
import authConfig from "src/configs/auth";
import myDetailsConfig from "src/configs/myDetails";
import OtpDialog from "src/components/account/OtpDialog";




import { useAuth } from "src/hooks/useAuth";
import axios from 'axios'
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AlertDialog from "src/components/AlertDialog";
import LoadingSpinnerWithText from "src/components/LoadingSpinnerWithText";
//seo
import { ChangePasswordSeo } from "../../seo/seo";
export default function ChangePassword() {
  const [saveLoading, setSaveLoading] = useState(false)
  const auth = useAuth();
  const [userData, setUserData] = useState(auth.user);

  const schema = yup.object().shape({
    password: yup.string().min(5, 'password must be at least 5 characters').required('Password is a required field'),
    confirm_password: yup.string().min(5, 'Confirm Password must be at least 5 characters').required('Confirm Password is a required field').oneOf([yup.ref('password')], 'Password does not match'),
  });

  const defaultValues = {
    password: '',
    confirm_password: '',
  }

  const {
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

  const [formData, setFormData] = useState(null);
  const [sendLinkkTo, setSendLinkTo] = useState((userData.email ? userData.email : (userData.mobileNo ? userData.mobileNo : '')));

  const onSubmit = (data) => {
    setSaveLoading(true)
    const { password, confirm_password } = data
    setFormData(data);
    const headers = {
      Accept: 'application/json',
      // 'Content-Type': 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + window.localStorage.getItem(authConfig.storageTokenKeyName)
    }
    const storedToken =
      "Bearer " + window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      axios.post(myDetailsConfig.resendOtpUsingIdEndpoint, { id: sendLinkkTo }, {
        headers: {
          Authorization: storedToken,
        },
      })
        .then(async (res) => {
          setSaveLoading(false)
          setOtpDialogOpen(true)
        })
    } catch (e) {
      setSaveLoading(false)
    }


  }

  const [openAlert, setOpenAlert] = useState(false)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('confirm')
  const [msg, setMsg] = useState('')
  const continueEditing = (otp) => {
    const { password, confirm_password } = formData;


    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + window.localStorage.getItem(authConfig.storageTokenKeyName)
    }
    try {
      axios.post(myDetailsConfig.setPasswordEndpoint, { id: sendLinkkTo, otp: otp, password: confirm_password }, { headers })
        .then(async (res) => {
          setOpenAlert(true)
          setType('success')
          setTitle('Success')
          setMsg('password changed sucessfully!')

        })
    } catch (e) {
      setOpenAlert(true)
      setType('error')
      setTitle('Error')
      setMsg('Something went wrong!')
      if (e?.response?.status == 409) {
      }
    }
    setOtpDialogOpen(false)
  }

  const closeDialog = () => {
    if (type == 'success') {
      reset()
    }
    setOpenAlert(false)
  }




  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  return (
    <>
      <ChangePasswordSeo />
      <AlertDialog
        isOpen={openAlert}
        onClose={closeDialog}
        type={type}
        title={title}
        content={msg}
      />
      <TitleWithSummary
        title="Change Password"
        summary="Ensure the security of your account by updating your password regularly."
      />
      <div className="rounded-xl border bg-white p-6 md:mt-4 md:w-1/2">
        <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>

          <div className="space-y-6">
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  disabled={saveLoading}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  id="password"
                  type="password"
                  label="New Password"
                // className="input"
                // placeholder="Enter your name"
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
                  disabled={saveLoading}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  id="confirm_password"
                  type="password"
                  label="Confirm Password"
                // className="input"
                // placeholder="Enter your name"
                />
              )}
            />
            {errors.confirm_password && (
              <p style={{ marginTop: 0 }} className="text-sm text-red-500">
                {errors.confirm_password.message}
              </p>
            )}
            {/* <Input id="current" type="password" label="Current Password" /> */}
            {/* <Input id="new" type="password" label="New Password" />
          <Input id="confirm" type="password" label="Confirm Password" /> */}
          </div>
          <div className="mt-6">
            <button disabled={saveLoading} type='submit' className={`min-w-[90px] rounded-md ${saveLoading ? 'bg-gray-200' : 'bg-green-500'} py-2 px-4 font-medium text-white hover:bg-green-600`}>
              {saveLoading ? (
                <LoadingSpinnerWithText text={'Save'} />
              ) : 'Save'}
            </button>
          </div>
        </form>
      </div>
      {otpDialogOpen && (

        <OtpDialog isOpen={otpDialogOpen} onClose={() => setOtpDialogOpen(false)} to={(userData.email ? (userData.email) : (userData.mobileNo ? (userData.mobileNo) : ('')))} continueEditing={continueEditing} formData={formData} from={'change-password'} />
      )}
    </>
  );
}

ChangePassword.getLayout = function getLayout(page) {
  return <UserDashboardLayout>{page}</UserDashboardLayout>;
};
