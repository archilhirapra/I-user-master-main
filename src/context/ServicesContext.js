import {
    createContext,
    useCallback,
    useMemo,
    useState,
    useEffect,
    useContext,
} from 'react'

import axios from 'axios'

import servicesConfig from "src/configs/servicesConfig";
import authConfig from "src/configs/auth";
import { categorizeByCategoryName } from 'src/helper/categorizeOrderItems';

const DeliveryInformationInitials = {
    // variables for api
    pickupAddressId: "",
    deliveryAddressId: "",
    preferrdPickupId: "",
    preferrdDeliveryId: "",
    preferrdPickupTime: "",
    preferrdDeliveryTime: "",
    pickupInstruction: "doorbell",
    deliveryInstruction: "doorbell",
    // to display selected options,
    pickupAddress: "",
    pickupAddressType: "",
    pickupAddressCity: "",
    deliveryAddress: "",
    deliveryAddressType: "",
    deliveryAddressCity: "",
    pickupTimeSlot: "",
    pickupDate: "",
    deliveryTimeSlot: "",
    deliveryDate: "",

}

const SavedUserInfoInitials = {
    _id: "",
    deliveryAddressId: "",
    deliveryInstruction: "",
    pickupAddressId: "",
    pickupInstruction: "",
    preferrdDeliveryId: "",
    preferrdDeliveryTime: "",
    preferrdPickupId: "",
    preferrdPickupTime: "",
    deliveryAddress: {
        addressType: "",
        isDefault: false,
        pincode: "",
        houseNo: "",
        street: "",
        placeName: "",
        placeAddress: "",
        district: "",
        locality: "",
        landmark: "",
        mobileNo: "",
        countryCode: "",
        lat: 40.740106,
        long: -73.990604,
        city: "",
        region: "",
        country: "",
        userId: "",
        isActive: true,
        createdAt: "",
        updatedAt: "",
        id: ""
    },
    pickupAddress: {
        addressType: "",
        isDefault: false,
        pincode: "",
        houseNo: "",
        street: "",
        placeName: "",
        placeAddress: "",
        district: "",
        locality: "",
        landmark: "",
        mobileNo: "",
        countryCode: "",
        lat: 40.740106,
        long: -73.990604,
        city: "",
        region: "",
        country: "",
        userId: "",
        isActive: true,
        createdAt: "",
        updatedAt: "",
        id: ""
    },
    lastOrderId: ""
}

export const ServicesContext = createContext()


export const ServicesContextProvider = ({ children }) => {
    const [isServicesLoading, setIsServicesLoading] = useState(false);
    const [isItemsInCartLoading, setIsItemsInCartLoading] = useState(false);
    const [isServiceFAQLoading, setIsServiceFAQLoading] = useState(false);
    const [isItemsListLoading, setIsItemsListLoading] = useState(false);

    // run useeffect after window is loaded
    const [headers, setHeaders] = useState({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: ""
    })

    useEffect(() => {
        // if window is loaded
        if (typeof window !== 'undefined') {
            setHeaders(prev => ({
                ...prev,
                Authorization: "Bearer " + window.localStorage.getItem(authConfig.storageTokenKeyName)
            }))
        }
    }, [])


    const [itemsInCart, setItemsInCart] = useState([])
    const [serviceFAQ, setServiceFAQ] = useState([]);
    const [itemsList, setItemsList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [deliveryInformation, setDeliveryInformation] = useState(DeliveryInformationInitials)

    const [savedUserInfo, setSavedUserInfo] = useState(SavedUserInfoInitials)

    const [servicesCategories, setServicesCategories] = useState([]);
    const [userOrderInfo, setUserOrderInfo] = useState({})

    const fetchAddedItems = useCallback(async (orderId) => {
        setIsItemsInCartLoading(true)

        const response = await axios.get(servicesConfig.getUserOrdersEndpoint + orderId, { headers: headers })

        const { orderItems } = response.data.data.data
        setUserOrderInfo(response.data.data.data)

        setItemsInCart(() => categorizeByCategoryName(orderItems))
        setIsItemsInCartLoading(false)
    }, [headers])

    const fetchServicesFAQ = useCallback(async (categoryId, headers) => {
        const response = await axios.get(servicesConfig.getServicesFAQEndpoint + categoryId, {
            headers: headers
        })
        setServiceFAQ(response.data.data.data)
        setIsServiceFAQLoading(false)
    }, [headers])


    const onPickupInstructionChange = useCallback((e) => {
        setDeliveryInformation(prev => ({
            ...prev,
            pickupInstruction: e.target.value
        }))
    }, [])

    const onDeliveryInstructionChange = useCallback((e) => {
        setDeliveryInformation(prev => ({
            ...prev,
            deliveryInstruction: e.target.value
        }))
    }, [])

    const fetchItemList = useCallback(async (categoryId) => {
        setIsItemsListLoading(true)
        setIsServiceFAQLoading(true)
        const response = await axios.get(servicesConfig.getItemList + categoryId, {
            headers: headers
        })
        setItemsList(response.data.data.data)
        setIsItemsListLoading(false)
        fetchServicesFAQ(categoryId, headers)
    }, [fetchServicesFAQ, headers])

    const fetchSavedUserInfo = useCallback(async () => {
        const response = await axios.get(servicesConfig.getSavedInfoEndpoint, { headers: headers })
        setSavedUserInfo(response.data.data.data)
        // fetch added items if response contains orderId

        if (response.data.data.data.lastOrderId) {
            fetchAddedItems(response.data.data.data.lastOrderId)
        }
    }, [headers, fetchAddedItems])

    const fetchServicesCategories = useCallback(async () => {
        setIsServicesLoading(true)
        const response = await axios.get(servicesConfig.getCategoryEndPoint, {
            headers: headers
        })
        setServicesCategories(response.data.data.data)
        setSelectedCategory(response.data.data.data[0])
        fetchItemList(response.data.data.data[0].id)
        setIsServicesLoading(false)
    }, [fetchItemList, headers])


    const onItemAddorRemoveToCart = useCallback(async (itemData, orderId, action) => {
        const { categoryId, id: itemId, } = itemData

        const {
            pickupAddressId,
            deliveryAddressId,
            preferrdPickupId,
            preferrdDeliveryId,
            preferrdPickupTime,
            preferrdDeliveryTime,
            pickupInstruction,
            deliveryInstruction } = deliveryInformation


        if (!preferrdPickupId || !preferrdDeliveryId || !preferrdPickupTime || !preferrdDeliveryTime) {
            // setSaveInformationError({
            //     hasError: true,
            //     message: "Please select all fields"
            // })
            // setIsSubmitting(false)
            // let error = { status: false }
            // return false
        }



        if (!orderId) {
            const response = await axios.post(servicesConfig.addOrderEndPoint, {
                items: [
                    {
                        itemId,
                        qty: action === "add" ? 1 : -1,
                        categoryId
                    }
                ]
            }, {
                headers: headers
            })
            if (response.data.data.data) {
                // fetchAddedItems(response.data.data.data.id)
                fetchSavedUserInfo()
            }
            return;
        }

        const data = {
            itemId,
            qty: action === "add" ? 1 : -1,
            categoryId,
            orderId
        }
        try {
            const response = await axios.post(servicesConfig.addItemToCartEndpoint, {
                ...data
            }, {
                headers: headers
            })
            if (response.data.data.data) {
                fetchAddedItems(orderId)
            }
        } catch (error) {
            console.error("Error while adding product to the cart ")
        }
    }, [headers, fetchAddedItems])


    const onMakePayment = (orderId, callback) => {
        // setIsItemsInCartLoading(true)



        if (savedUserInfo?.deliveryAddress == null || savedUserInfo?.deliveryAddressId == null || savedUserInfo?.pickupAddress == null || savedUserInfo?.pickupAddressId == null) {
            // return { status: false, message: 'address detail not found' }
            callback({ status: false, message: 'address detail not found' })
        }


        try {

            axios.put(servicesConfig.orderPaymentLinkEndpoint, { orderId }, { headers: headers })
                .then(async (res) => {
                    callback({ status: true, message: res?.data?.data?.data?.link })

                })
                .catch((err) => {

                    callback({ status: false, message: err.response.data.message })


                })

        }
        catch (e) {

            callback({ status: false, message: e })
        }





    }



    const value = useMemo(() => ({
        deliveryInformation,
        setDeliveryInformation,
        savedUserInfo,
        setSavedUserInfo,
        servicesCategories,
        setServicesCategories,
        fetchSavedUserInfo,
        fetchAddedItems,
        fetchServicesCategories,
        fetchServicesFAQ,
        fetchItemList,
        isServicesLoading,
        itemsInCart,
        setItemsInCart,
        isItemsInCartLoading,
        setIsItemsInCartLoading,
        serviceFAQ,
        setServiceFAQ,
        isServiceFAQLoading,
        setIsServiceFAQLoading,
        itemsList,
        setItemsList,
        isItemsListLoading,
        setIsItemsListLoading,
        selectedCategory,
        setSelectedCategory,
        onItemAddorRemoveToCart,
        userOrderInfo,
        onPickupInstructionChange,
        onDeliveryInstructionChange,
        onMakePayment
    }), [
        deliveryInformation,
        setDeliveryInformation,
        savedUserInfo,
        setSavedUserInfo,
        servicesCategories,
        setServicesCategories,
        fetchSavedUserInfo,
        fetchAddedItems,
        fetchServicesCategories,
        fetchServicesFAQ,
        fetchItemList,
        isServicesLoading,
        itemsInCart,
        setItemsInCart,
        isItemsInCartLoading,
        setIsItemsInCartLoading,
        serviceFAQ,
        setServiceFAQ,
        isServiceFAQLoading,
        setIsServiceFAQLoading,
        itemsList,
        setItemsList,
        isItemsListLoading,
        setIsItemsListLoading,
        selectedCategory,
        setSelectedCategory,
        onItemAddorRemoveToCart,
        userOrderInfo,
        onPickupInstructionChange,
        onDeliveryInstructionChange,
        onMakePayment
    ])

    return (
        <ServicesContext.Provider value={value}>
            {children}
        </ServicesContext.Provider>
    )
}

export const useServicesContext = () => {
    const { deliveryInformation,
        setDeliveryInformation,
        savedUserInfo,
        setSavedUserInfo,
        servicesCategories,
        setServicesCategories,
        fetchSavedUserInfo,
        fetchAddedItems,
        fetchServicesCategories,
        fetchServicesFAQ,
        fetchItemList,
        isServicesLoading,
        itemsInCart,
        setItemsInCart,
        isItemsInCartLoading,
        setIsItemsInCartLoading,
        serviceFAQ,
        setServiceFAQ,
        isServiceFAQLoading,
        setIsServiceFAQLoading,
        itemsList,
        setItemsList,
        isItemsListLoading,
        setIsItemsListLoading,
        selectedCategory,
        setSelectedCategory,
        onItemAddorRemoveToCart,
        userOrderInfo,
        onPickupInstructionChange,
        onDeliveryInstructionChange,
        onMakePayment
    } = useContext(ServicesContext)

    return useMemo(() => ({
        deliveryInformation,
        setDeliveryInformation,
        savedUserInfo,
        setSavedUserInfo,
        servicesCategories,
        setServicesCategories,
        fetchSavedUserInfo,
        fetchAddedItems,
        fetchServicesCategories,
        fetchServicesFAQ,
        fetchItemList,
        isServicesLoading,
        itemsInCart,
        setItemsInCart,
        isItemsInCartLoading,
        setIsItemsInCartLoading,
        serviceFAQ,
        setServiceFAQ,
        isServiceFAQLoading,
        setIsServiceFAQLoading,
        itemsList,
        setItemsList,
        isItemsListLoading,
        setIsItemsListLoading,
        selectedCategory,
        setSelectedCategory,
        onItemAddorRemoveToCart,
        userOrderInfo,
        onPickupInstructionChange,
        onDeliveryInstructionChange,
        onMakePayment
    }), [
        deliveryInformation,
        setDeliveryInformation,
        savedUserInfo,
        setSavedUserInfo,
        servicesCategories,
        setServicesCategories,
        fetchSavedUserInfo,
        fetchAddedItems,
        fetchServicesCategories,
        fetchServicesFAQ,
        fetchItemList,
        isServicesLoading,
        itemsInCart,
        setItemsInCart,
        isItemsInCartLoading,
        setIsItemsInCartLoading,
        serviceFAQ,
        setServiceFAQ,
        isServiceFAQLoading,
        setIsServiceFAQLoading,
        itemsList,
        setItemsList,
        isItemsListLoading,
        setIsItemsListLoading,
        selectedCategory,
        setSelectedCategory,
        onItemAddorRemoveToCart,
        userOrderInfo,
        onPickupInstructionChange,
        onDeliveryInstructionChange,
        onMakePayment
    ])
}