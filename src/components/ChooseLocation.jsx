import React, { useState } from "react";
import {
  RiArrowLeftSLine,
  RiBuildingFill,
  RiFocus3Line,
  RiHomeHeartFill,
  RiMapPin2Fill,
  RiMapPinFill,
  RiSearchLine,
} from "react-icons/ri";
import { AddressCard } from "../pages/account/saved-address";
import dynamic from "next/dynamic";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import axios from "axios";
import authConfig from 'src/configs/auth'
import locationConfig from 'src/configs/locations'
import { deformatPhoneNumber, formatPhoneNumber } from "src/helper/helper";
import LoadingSpinner from "./LoadingSpinner";

const MapWithNoSSR = dynamic(() => import("./Map"), {
  ssr: false,
});

const demoSearchData = [
  { name: "Flemington", address: "334 New Jersey 31" },
  { name: "East Lansing", address: "1500 W Lake Lansing Rd #5" },
  { name: "Reisterstown", address: "11613 Reisterstown Rd" },
  { name: "Anchorage", address: "1801 W Dimond Blvd" },
  { name: "Flemington", address: "334 New Jersey 31" },
  { name: "East Lansing", address: "1500 W Lake Lansing Rd #5" },
  { name: "Reisterstown", address: "11613 Reisterstown Rd" },
  { name: "Anchorage", address: "1801 W Dimond Blvd" },
];

function ChooseLocation({ showSavedAddresses = true, onSaveAddress }) {
  const [searchData, setSearchData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const selectedAddressInitialValue = {
    street: "",
    houseNo: "",
    isDefault: true,
    addressType: "Home",
    mobileNo: "",
    countryCode: "",
    placeName: "",
    placeAddress: "",
    // lat: 40.740106,
    // long: -73.990604,
    landmark: "",
    pincode: "",
    locality: "",
    city: "",
    district: "",
    region: "",
    country: ""
  }
  const [selectedAddress, setSelectedAddress] = useState({
    street: "",
    houseNo: "",
    isDefault: true,
    addressType: "Home",
    mobileNo: "",
    countryCode: "",
    placeName: "",
    placeAddress: "",
    lat: 40.740106,
    long: -73.990604,
    landmark: "",
    pincode: "",
    locality: "",
    city: "",
    district: "",
    region: "",
    country: "",
    // extra: ""
  });

  const [expanded, setExpanded] = useState(false);
  const [isMapBlurred, setIsMapBlurred] = useState(true);

  const changeSelectedAddress = async (data, from = '') => {
    if (isMapBlurred && from != 'list') {
      return
    }
    // setSelectedAddress(prev => ({ ...prev, ...data }))
    setCurrentLatitude(data.lat);
    setCurrentLongitude(data.long);
    const address = await getAddressFromLatLong(data.lat, data.long);
    // setSearchData([])
    setSelectedAddress(prev => ({ ...prev, ...address }));
  }



  const handleQueryChange = (e) => {
    setSearchQuery(e.target.value);

    // if(e.target.value===''){
    //   setIsMapBlurred(true)
    // }



    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + window.localStorage.getItem(authConfig.storageTokenKeyName)
    }

    axios
      .get(locationConfig.getSuggestionsEndpoint, { params: { text: e.target.value }, headers: headers })
      .then(response => {
        setSearchData(response.data.data.data)
      })
      .catch(() => {
        setSearchData(null)
      })
  };
  const toggleExpand = () => {
    setExpanded((old) => !old);
  };

  //logic Starting

  const [savedAddresses, setSavedAddresses] = useState(null);
  useEffect(() => {
    if (showSavedAddresses) {

      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + window.localStorage.getItem(authConfig.storageTokenKeyName)
      }
      axios
        .get(locationConfig.getAddressEndpoint, { headers })
        .then(response => {
          setSavedAddresses(response.data.data.data)

        })
        .catch(() => {
          setSavedAddresses(null)
        })
    }
  }, [])


  // [40.8054, -74.0241]
  const [currentLatitude, setCurrentLatitude] = useState(40.8054);
  const [currentLongitude, setCurrentLongitude] = useState(-74.0241);
  const [flyLoading, setFlyLoading] = useState(false);

  const getCurrentGeoLocation = () => {
    setFlyLoading(true)
    if ('geolocation' in navigator) {
      setIsMapBlurred(false);
      navigator.geolocation.getCurrentPosition(async (success) => {
        setCurrentLatitude(success.coords.latitude);
        setCurrentLongitude(success.coords.longitude);
        const address = await getAddressFromLatLong(success.coords.latitude, success.coords.longitude);
        setSelectedAddress(prev => ({ ...prev, ...address }))
        setFlyLoading(false)

      }, (error) => {
        if (error?.code == 1) {
          alert('Please grant access to location')
        }
        setFlyLoading(false)
        // console.log(error, 'error')
      }, { maximumAge: 0 });

    } else {
      alert('Please grant access to location')
    }

  }

  const onDragEnd = async (lat, long) => {
    if (!flyLoading) {
      // setFlyLoading(true)
      setCurrentLatitude(lat);
      setCurrentLongitude(long);
      if (lat === currentLatitude && long === currentLongitude) return;
      const address = await getAddressFromLatLong(lat, long);
      setSelectedAddress(prev => ({ ...prev, ...address }));
      // setFlyLoading(false)
    }
  }

  const getAddressFromLatLong = async (lat, long) => {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + window.localStorage.getItem(authConfig.storageTokenKeyName)
    }
    try {
      const response = await axios.get(locationConfig.getAddressFromLatLngEndpoint, { params: { lat, long } }, { headers });
      return response.data.data.data
    } catch (error) {
      setSelectedAddress(null)
    }
    // setFlyLoading(false)
  }


  const [listSelected, setListSelected] = useState(false)
  const onSearchItemClick = (data) => {
    setListSelected(true)
    setSelectedAddress({ addressType: 'Home', mobileNo: '' })
    setIsMapBlurred(false);
    changeSelectedAddress(data, 'list')
  }


  const saveFinalAddress = (from, data) => {

    onSaveAddress(data.id, data)
  }

  const isCurrentSelectedAddress = (type) => {
    if (selectedAddress.addressType === type) {
      return 'bg-body border-body text-white'
    }
    return "bg-white border-body/80"
  }

  const onAddressTypeClick = (type) => {
    setSelectedAddress(prev => ({ ...prev, addressType: type }))
  }

  const onAddressInfoChange = (e) => {
    setSelectedAddress(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const onCheckboxChange = (e) => {
    setSelectedAddress(prev => ({ ...prev, [e.target.name]: e.target.checked }))
  }

  const onSaveInformation = () => {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + window.localStorage.getItem(authConfig.storageTokenKeyName)
    }
    let params = selectedAddress
    params.mobileNo = deformatPhoneNumber(params.mobileNo)

    axios.post(locationConfig.saveUserAddressEndpoint, selectedAddress, { headers })
      .then(response => {
        onSaveAddress(response.data.data.data.addressId, selectedAddress)
      })
      .catch(error => {

      }
      )
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden md:h-[85vh]">
      <div className="sticky top-0 z-10 border-b bg-white px-5 py-4 md:p-6">
        <h2 className="text-lg font-semibold">{"Choose Location"}</h2>
        <p className="text-sm text-dark/80">
          Select your preferred location for pick-up and delivery
        </p>
      </div>
      <div className="relative flex grow overflow-hidden">
        <>
          {selectedAddress.placeName && selectedAddress.placeAddress ? (selectedAddress.placeName && (selectedAddress.placeAddress && (
            <div className="absolute bottom-0 z-[500] mt-auto flex max-h-[60vh] w-full flex-col overflow-hidden bg-white py-4 px-5 md:static md:h-full md:max-h-full md:max-w-[22rem]">
              {/*implement your logic for button click, maybe goto step 1*/}
              <button
                onClick={() => {

                  setSelectedAddress({ addressType: 'Home' })
                  // setSelectedAddress(selectedAddressInitialValue)
                  setIsMapBlurred(true)
                  setFlyLoading(false)
                }}
                className="flex items-center text-sm text-dim hover:text-body"
              >
                <RiArrowLeftSLine className="h-4 w-4 shrink-0 rounded-md border border-gray-200" />
                <span className="ml-1.5 font-medium">Search</span>
              </button>

              <div className="my-3 grow overflow-auto scrollbar-thin">
                <button
                  onClick={toggleExpand}
                  className="absolute top-2 right-2 rounded-md text-dim hover:text-body md:hidden"
                >
                  {expanded ? (
                    <ChevronDownIcon className="h-9 w-9 stroke-2 p-2" />
                  ) : (
                    <span className="m-1 inline-block rounded-md bg-gray-100 px-4 py-2 text-sm font-medium">
                      Edit Address
                    </span>
                  )}
                </button>

                <div className="mt-2">
                  <div className="font-semibold">{selectedAddress.title}</div>
                  <div className="mt-1 text-sm text-dim">
                    {selectedAddress.placeName}
                  </div>
                  <div className="mt-1 text-sm text-dim">
                    {selectedAddress.placeAddress && selectedAddress.placeAddress}
                  </div>
                  <div className={`${expanded ? "block" : "hidden"} md:block`}>
                    <div className="mt-4 flex gap-3">
                      <button onClick={() => onAddressTypeClick("Home")} className={`${isCurrentSelectedAddress('Home')} flex w-full items-center justify-center gap-1 rounded-md border px-4 py-2 text-sm font-medium`}>
                        <RiHomeHeartFill className="h-4 w-4" />
                        <span>Home</span>
                      </button>
                      <button onClick={() => onAddressTypeClick("Office")} className={`${isCurrentSelectedAddress('Office')} flex w-full items-center justify-center gap-1 rounded-md border  px-4 py-2 text-sm font-medium `}>
                        <RiBuildingFill className="h-4 w-4" />
                        <span>Office</span>
                      </button>
                      <button onClick={() => onAddressTypeClick("Other")} className={`${isCurrentSelectedAddress('Other')} flex w-full items-center justify-center gap-1 rounded-md border  px-4 py-2 text-sm font-medium`}>
                        <RiMapPinFill className="h-4 w-4" />
                        <span>Other</span>
                      </button>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div>
                        <label htmlFor="houseNo" className="label">
                          House No.
                        </label>
                        <input
                          id="houseNo"
                          type="text"
                          onChange={onAddressInfoChange}
                          name="houseNo"
                          className="input"
                          placeholder="Enter house number"
                        />
                      </div>
                      <div>
                        <label htmlFor="address" className="label">
                          Specify Address
                        </label>
                        <textarea
                          id="address"
                          rows={2}
                          name="street"
                          onChange={onAddressInfoChange}
                          className="input resize-none text-sm"
                          placeholder="Enter the apartment name, house number, floor, etc."
                        />
                      </div>
                      <div>
                        <label htmlFor="mobile" className="label">
                          Alternate Mobile No.
                        </label>
                        <input
                          value={formatPhoneNumber(selectedAddress?.mobileNo)}
                          id="mobile"
                          name="mobileNo"
                          onChange={onAddressInfoChange}
                          type="text"
                          className="input"
                          placeholder="Enter mobile number"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          name="isDefault"
                          type="checkbox"
                          className="accent-primary"
                          id="default"
                          onChange={onCheckboxChange}
                        />
                        <label htmlFor="default" className="label ml-2">
                          Set address as default
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button className="btn btn-primary w-full text-sm" onClick={onSaveInformation}>
                Save Changes
              </button>
            </div>
          ))

          ) : (
            <div className="absolute z-[500] flex h-full w-full flex-col overflow-hidden md:static md:max-w-[22rem]">
              <div className="h-full overflow-auto bg-gray-50 scrollbar-thin">
                <div className="sticky top-0 z-10 border-b bg-white p-4 px-5">
                  <div className="input flex items-center bg-gray-100 p-0 px-2 text-sm focus-within:border-primary">
                    <RiSearchLine className="h-5 w-5 text-dim" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleQueryChange}
                      placeholder="Search Location"
                      className="input-reset p-2"
                    />
                  </div>
                  <button disabled={flyLoading} onClick={getCurrentGeoLocation} className="mt-4 flex w-full items-center rounded-md border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-start text-primary transition-colors hover:bg-gray-100">
                    <RiFocus3Line className={`h-6 w-6 ${flyLoading && 'text-dim'}`} />
                    <div className={`ml-3 text-xs ${flyLoading && 'text-dim'}`}>
                      <p className="font-semibold leading-5">
                        Current Location
                      </p>
                      <p className="text-dim">Click to use your location</p>
                    </div>
                    {flyLoading && (
                      <LoadingSpinner/>
                    )}
                  </button>
                </div>
                {searchQuery && (
                  <div className="divide-y">
                    {searchData?.map((data, index) => {
                      return (
                        <div
                          key={index}
                          onClick={() => onSearchItemClick(data)}
                          className="flex cursor-pointer items-center bg-white px-5 py-3 hover:bg-gray-100"
                        >
                          <RiMapPin2Fill className="h-4 w-4 shrink-0 text-primary" />
                          <div className="ml-3">
                            <p className="text-sm font-semibold">{data.title}</p>
                            <p className="text-xs text-dim">{data.placeName}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {!searchQuery && (
                  <>
                    <div className="space-y-3 px-5 py-4">
                      {/*  loop user saved addresses */}
                      {showSavedAddresses && savedAddresses?.map((address, index) => {
                        return (
                          <div key={index} onClick={() => saveFinalAddress('saved', address)}>
                            <AddressCard
                              showMenu={false}
                              isDefault={address.isDefault}
                              // isDefault
                              title={address.addressType}
                              // address="334 New Jersey 31"
                              address={(address.houseNo ? address.houseNo : '') + ' ' + (address.street ? address.street : '') + ' ' + address.placeAddress}
                            // address={threeDotAfterText(address.houseNo + ' ' + address.street + ' ' + address.placeAddress, 50)}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </>

                )}
              </div>
            </div>
          )}
        </>
        {/* <div className="backdrop-blur-sm h-full w-full"> */}
        <MapWithNoSSR
          setFlyLoading={setFlyLoading}
          isMapBlurred={isMapBlurred}
          long={currentLongitude}
          setLong={setCurrentLongitude}
          lat={currentLatitude}
          setLat={setCurrentLatitude}
          onDragEnd={onDragEnd}
          fly={flyLoading}
          listSelected={listSelected}
          setListSelected={setListSelected}
        />
        {/* </div> */}
      </div>
    </div>
  );
}

export default ChooseLocation;