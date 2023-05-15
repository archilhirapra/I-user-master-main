import React, { useEffect, useState } from "react";
import myDetails from "src/configs/myDetails";
import authConfig from "src/configs/auth";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import { getInitialsFromDate } from "src/helper/formatDate";

function TimeSlotPicker({ title = "Choose Time Slot", subtitle = 'Choose your prefered time', onSaveBtnClick, pickerFor, deliveryInformation }) {

  const [timeSlots, setTimeSlots] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)

  const [isDeliveryDateAvailable, setIsDeliveryDateAvailable] = useState(!!deliveryInformation.pickupDate && !!deliveryInformation.preferrdPickupId)
  const [isHaveDeliveryData, setHaveDeliveryData] = useState(false)

  useEffect(() => {
    if (pickerFor === 'pickupDate') {
      getAvailablePickupDates()
    }
    if (pickerFor === 'deliveryDate' && !!deliveryInformation.pickupDate && !!deliveryInformation.preferrdPickupId) {
      getAvailablePickupDates(deliveryInformation.preferrdPickupId)
    }
  }, []);


  const getAvailablePickupDates = async (preferrdPickupId = null) => {
    setIsLoading(true)
    let response = null;
    if (pickerFor === 'deliveryDate' && isDeliveryDateAvailable) {
      setIsDeliveryDateAvailable(true)
      setIsLoading(true)
      response = await axios.get(myDetails.getDeliveryDaysEndpoint + `${deliveryInformation.preferrdPickupId}`, {
        headers: {
          Authorization: "Bearer " + window.localStorage.getItem(authConfig.storageTokenKeyName),
        },
      });
      if(response.data.data.data.length===0){
        setIsDeliveryDateAvailable(false)
        setHaveDeliveryData(true)
      }
    }
    if (pickerFor === 'pickupDate' && preferrdPickupId === null) {
      response = await axios.get(myDetails.getPickupDaysEndpoint, {
        headers: {
          Authorization: "Bearer " + window.localStorage.getItem(authConfig.storageTokenKeyName),
        },
      });
    }
    const responseData = response.data.data.data
    setTimeSlots(responseData)
    if (responseData.length != 0) {
      setAvailableTimes(responseData[0].timeSlots)
      setSelectedDate(responseData[0])
      setSelectedTime(responseData[0].timeSlots[0])
    }
    setIsLoading(false)
  }

  const onDateClick = (dateInfo) => {
    setSelectedDate(dateInfo)
    setAvailableTimes(dateInfo.timeSlots)
    setSelectedTime(dateInfo.timeSlots[0])
  }

  const onTimeClick = (timeInfo) => {
    setSelectedTime(timeInfo)
  }

  const onSave = () => {
    onSaveBtnClick(selectedTime)
  }


  return (
    <>
      <div className="flex h-full flex-col overflow-auto" style={{
        minHeight: "calc(100vh - 400px)",
      }}>
        {
          isLoading ? <LoadingSpinner position="center" /> :
            <>
              {
                pickerFor === 'deliveryDate' && !isDeliveryDateAvailable ?
                  <div className="grid h-96 place-items-center">
                    {isHaveDeliveryData ? (
                      <>
                        <span className="text-center text-lg text-dark">
                          Please Select Another Date!
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-center text-lg text-dark">
                          Please Select Pickup Date First!
                        </span>
                      </>
                    )}

                  </div>
                  : <>
                    <div className="sticky top-0 z-10 border-b bg-white px-5 py-4 md:p-6">
                      <h2 className="text-lg font-semibold">{title}</h2>
                      <p className="text-sm text-dark/80">
                        {subtitle}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-4 overflow-auto p-5">
                      {timeSlots.length > 0 && timeSlots.map((eachDay, index) => (
                        <div
                          key={index}
                          className={`flex h-24 w-24 shrink-0 cursor-pointer flex-col rounded-xl border-2 py-2 px-3 text-sm font-medium ${selectedDate.date === eachDay.date ? "border-primary/80 bg-primary/5 text-primary" : ""
                            }`}
                          onClick={() => onDateClick(eachDay)}
                        >
                          <div>{getInitialsFromDate(eachDay.date, 'MMM')}</div>
                          <div className="my-auto text-center text-3xl font-semibold">
                            {getInitialsFromDate(eachDay.date, 'dd')}
                          </div>
                          <div className="text-center">{getInitialsFromDate(eachDay.date, 'EEEE')}</div>
                        </div>
                      ))}
                    </div>
                    <div className="py-4 px-5">
                      <div className="text-sm text-dark/80">
                        At what time should the rider arrive?
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                        {
                          availableTimes.length > 0 && availableTimes.map((availableTime, index) => (
                            <div
                              key={availableTime.id}
                              onClick={() => onTimeClick(availableTime)}
                              className={`cursor-pointer rounded-lg border-2 p-2 text-center font-medium ${selectedTime.timeSlot === availableTime.timeSlot ? "border-primary/80 bg-primary/5 text-primary" : ""}`}
                            >
                              {availableTime.timeSlot}
                            </div>
                          ))
                        }
                      </div>
                    </div>
                    <div className="m-6 mx-5 my-4 rounded-lg bg-gray-100 p-5">
                      <div className="text-sm font-medium text-dark/90">You have chosen</div>
                      <div className="mt-1 flex flex-wrap gap-1 font-semibold md:text-lg">
                        <span>{getInitialsFromDate(selectedDate?.date, 'LLLL, dd, yyyy')}</span>
                        <span className="md:ml-4">{selectedTime?.timeSlot}</span>
                      </div>
                    </div>
                    <div className="sticky bottom-0 z-10 mt-auto gap-4 border-t bg-white px-5 py-4 lg:flex">
                      <button onClick={onSave} className="w-full rounded-lg bg-primary px-12 py-3 text-white outline-none md:w-max">
                        Save
                      </button>
                    </div>
                  </>
              }
            </>
        }
      </div>
    </>
  );
}

export default TimeSlotPicker;
