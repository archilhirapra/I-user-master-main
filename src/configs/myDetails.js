import base from "./baseurl";

export default {
  updateUserEndpoint: base.baseurl + "/auth/updateUser",
  setPasswordEndpoint: base.baseurl + "/auth/setPassword",
  resendOtpUsingIdEndpoint: base.baseurl + "/auth/resendOtpUsingId",
  getPickupDaysEndpoint: base.baseurl + "/admin/getPickupDays",
  getDeliveryDaysEndpoint: base.baseurl + "/admin/getDeliveryDays?dateTimeId=",
};