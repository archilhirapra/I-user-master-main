import base from "./baseurl";

export default {
  loginEndpoint: base.baseurl + "/auth/login",
  resendOtpEndpoint: base.baseurl + "/auth/resendOtp",
  verifyOtpEndpoint: base.baseurl + "/auth/authenticateOtpLogin",
  meEndpoint: base.baseurl + "/auth/getProfile",
  forgetSetPassword: base.baseurl + "/auth/setPassword",

  mobileLoginEndpoint: base.baseurl + "/auth/login-mobile",

  emaileRegisterEndpoint: base.baseurl + "/auth/signup",
  
  storageTokenKeyName: "accessToken",
  
  
  googleLoginEndpoint: base.baseurl + "/auth/signUpWithGoogle",

};
