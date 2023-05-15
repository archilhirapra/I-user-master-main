import base from "./baseurl";

export default {
  getAddressEndpoint: base.baseurl + "/auth/address",
  getSuggestionsEndpoint: base.baseurl + "/auth/getSuggestions",
  getAddressFromLatLngEndpoint: base.baseurl + "/auth/getPlace",
  saveUserAddressEndpoint: base.baseurl + "/auth/addAddress",
  UpdateUserAddressEndpoint: base.baseurl + "/auth/updateAddress",
  // addressId
  RemoveUserAddressEndpoint: base.baseurl + "/auth/removeAddress"
};
