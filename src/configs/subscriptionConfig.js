import base from "./baseurl";

export default {
  getSubscriptionList: base.baseurl + "/auth/getPlan",
  getMembershipDetails: base.baseurl + "/admin/getMembershipDetails",
  getSubscriptionDetails: base.baseurl + "/auth/getSubscription",

  getMembershipDetailsOfUser: base.baseurl + "/auth/getDeluxMembership",

  // {
  //     "detailId":"636a2f21245d1faa86f3f1ae",
  //     "duration":1
  // }
  purchaseMembership: base.baseurl + "/auth/addDeluxMembership/v1",


  // {
  //     "planId":"6343f6993332b787fa9b7f6b",
  //     "duration":2
  // }
  purchaseSubscrition: base.baseurl + "/auth/addSubscription/v1",
  getCardDetails: base.baseurl + "/auth/getCards",
  checkIsSubscriptionIsCanceled: base.baseurl + "/auth/getSubscription",
  cancelMemberShip: base.baseurl + "/auth/cancelMembership",
};
