import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import UserDashboardLayout from "../../components/account/UserDashboardLayout";
import TitleWithSummary from "../../components/account/TitleWithSummary";
import { RiMapPin2Fill } from "react-icons/ri";
import React, { useEffect, useState } from "react";
import axios from "axios";
import locationConfig from 'src/configs/locations'
import authConfig from 'src/configs/auth'
import LoadingSpinner from "src/components/LoadingSpinner";
import LoadingSkeleton from "src/components/LoadingSkeleton";
import Modal from "src/components/Modal";
import ChooseLocation from "src/components/ChooseLocation";
import EditLocation from "src/components/EditLocation";
import AlertDialog from "src/components/AlertDialog";
//seo
import { AddressSeo } from "../../seo/seo";
export function AddressCard({ isDefault = false, title, address, editAddress, deleteAddress, showMenu = true }) {
  // you can pass onclick props for edit and delete or custom logic
  return (
    <div className="relative select-none rounded-lg border bg-white p-5 pr-10">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold">{title}</p>
          {isDefault && (
            <span className="whitespace-nowrap rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium">
              Default Address
            </span>
          )}
        </div>

        <div className="mt-2 flex space-x-1">
          <RiMapPin2Fill className="h-4 w-4 shrink-0 text-gray-300" />
          <p className="text-sm text-gray-600">{address}</p>
        </div>
      </div>
      {showMenu && (
        <div className="group absolute right-2 top-3 flex flex-col">
          <button className="ml-auto">
            <EllipsisVerticalIcon className="h-5 w-5 stroke-2" />
          </button>
          <div className="relative z-10 hidden rounded-md border border-gray-200 bg-white py-2 shadow-sm group-hover:block">
            <ul>
              <li onClick={() => editAddress()} className="flex cursor-pointer items-center space-x-2 px-2 py-1 text-sm hover:bg-blue-50">
                <PencilSquareIcon className="h-4 w-4" />
                <span>Edit</span>
              </li>
              <li onClick={() => deleteAddress()} className="flex cursor-pointer items-center space-x-2 px-2 py-1 text-sm hover:bg-blue-50">
                <TrashIcon className="h-4 w-4" />
                <span>Delete</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SavedAddress() {

  const [savedAddresses, setSavedAddresses] = useState(null);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [refresh, setRefresh] = useState(1)
  useEffect(() => {
    fetchSavedAddresses()
  }, [refresh])

  const fetchSavedAddresses = async () => {
    setIsLoading(true)
    try {
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

    } catch (error) {
      console.error("error while fetching saved addresses", error)
      setSavedAddresses(null)
    }
    setIsLoading(false)
  }





  const onDeliveryAddressSet = (deliveryId, deliveryAddressInfo) => {
    setDeliveryInformation({
      ...deliveryInformation,
      deliveryAddress: deliveryAddressInfo.placeAddress,
      deliveryAddressId: deliveryId
    })
    setSavedUserInfo(prev => ({
      ...prev, deliveryAddress: deliveryAddressInfo,
    }))
    closeDeliveryLocationModal()
  }



  const onSaveAddress = (addressId, addressInfo) => {
    // setSavedAddresses(prev => ([...prev, { ...addressInfo }]))
    setRefresh(refresh + 1)
    setShowAddAddressModal(false)
  }




  const [editAddressModal, setEditAddressModal] = useState(false);
  const closeEditAddressModal = () => setEditAddressModal(false);



  const [editRow, setEditRow] = useState(null)
  const onEditClick = (row) => {
    setEditAddressModal(true)
    setEditRow(row)
  }



  const onDeleteClicked = (row) => {



    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + window.localStorage.getItem(authConfig.storageTokenKeyName)
    }

    axios.delete(locationConfig.RemoveUserAddressEndpoint, { headers, data: { addressId: row.id } })
      .then(response => {
        setRefresh(refresh + 1)
        setOpenAlert(true)
        setTitle("Success")
        setType('success')
        setMsg('Address Deleted successfully!')
      })
      .catch(error => {
        setOpenAlert(true)
        setTitle("Error")
        setType('error')
        setMsg('Something went wrong!!')
      }
      )

  }

  const [openAlert, setOpenAlert] = useState(false)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('confirm')
  const [msg, setMsg] = useState('')

  const closeDialog = () => {
    // if (type == 'success') {
    //   closeEditAddressModal()
    //   setEditRow(null)
    // }
    setOpenAlert(false)
  }
  return (
    <>
      <AddressSeo />
      <AlertDialog
        isOpen={openAlert}
        onClose={closeDialog}
        type={type}
        title={title}
        content={msg}
      />
      {
        showAddAddressModal &&
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-900 bg-opacity-80"
            onClick={() => setShowAddAddressModal(false)}
          />
          <div className="absolute inset-0 w-full overflow-hidden bg-white md:relative md:max-w-4xl md:rounded-xl md:shadow-xl md:transition-all">
            <ChooseLocation showSavedAddresses={false} onSaveAddress={onSaveAddress} />
            <button
              onClick={() => setShowAddAddressModal(false)}
              className="absolute top-4 right-4 z-30 text-gray-400 hover:text-gray-900"
            >
              <XMarkIcon className="h-6 w-6 md:h-5 md:w-5" />
            </button>
          </div>
        </div>
      }
      {editAddressModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-900 bg-opacity-80"
            onClick={closeEditAddressModal}
          />
          <div className="absolute inset-0 w-full overflow-hidden bg-white md:relative md:max-w-4xl md:rounded-xl md:shadow-xl md:transition-all">
            <EditLocation editRow={editRow} setEditRow={setEditRow} onSaveAddress={onDeliveryAddressSet} closeEditAddressModal={closeEditAddressModal} refresh={refresh} setRefresh={setRefresh} />
            <button
              onClick={closeEditAddressModal}
              className="absolute top-4 right-4 z-30 text-gray-400 hover:text-gray-900"
            >
              <XMarkIcon className="h-6 w-6 md:h-5 md:w-5" />
            </button>
          </div>
        </div>
      )}
      <TitleWithSummary
        title="Saved Addresses"
        summary="Easily manage and edit your saved addresses for quick and convenient ordering."
      />
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <button onClick={() => setShowAddAddressModal(true)} className="flex h-full w-full select-none items-center justify-center space-x-2 rounded-lg bg-gray-100 p-5 pr-10 font-medium shadow-inner transition-colors hover:bg-gray-200">
          <PlusCircleIcon className="h-5 w-5" />
          <span>Add Address</span>
        </button>
        {
          isLoading ? <LoadingSkeleton /> : <>
            {savedAddresses && savedAddresses.map((address, index) => {
              return (
                <AddressCard
                  editAddress={() => onEditClick(address)}
                  deleteAddress={() => onDeleteClicked(address)}
                  isDefault={address.isDefault}
                  key={index}
                  title={address.addressType}
                  // address={address.houseNo + ' ' + address.street + ' ' + address.placeAddress}
                  address={(address.houseNo ? address.houseNo : '') + ' ' + (address.street ? address.street : '') + ' ' + address.placeAddress}

                />
              )
            })}
          </>
        }
      </div>
    </>
  );
}

SavedAddress.getLayout = function getLayout(page) {
  return <UserDashboardLayout>{page}</UserDashboardLayout>;
};
