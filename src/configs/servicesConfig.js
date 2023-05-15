import base from "./baseurl";

export default {
    getCategoryEndPoint: base.baseurl + "/auth/getCategory",
    getItemList: base.baseurl + "/auth/getItems?categoryId=",
    getServicesFAQEndpoint: base.baseurl + "/auth/getHelper?categoryId=",
    saveUserSessionEndpoint: base.baseurl + "/auth/addSession",
    addOrderEndPoint: base.baseurl+"/auth/addOrder",
    getSavedInfoEndpoint: base.baseurl + "/auth/getSession",
    getUserOrdersEndpoint: base.baseurl + "/auth/getUserOrders?orderId=",
    addItemToCartEndpoint: base.baseurl + "/auth/addOrderItem",
    applyCouponEndpoint: base.baseurl + "/auth/updateOrder",

    orderPaymentLinkEndpoint: base.baseurl + "/auth/getPaymentLink",

    getCouponsEndPoint: base.baseurl + "/auth/getCoupons",
};
