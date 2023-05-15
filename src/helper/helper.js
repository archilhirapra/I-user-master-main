// ** Returns initials from string
export const formatPhoneNumber = (value) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
    3,
    6
  )} - ${phoneNumber.slice(6, 10)}`;
}



export const deformatPhoneNumber = (value) => {
  if (value) {
    return (value.replace(/[^0-9]/g, '')).slice(0, 10);
  }else{
    return value
  }
}

export const formatOtp = (value) => {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(
    3,
    6
  )}`;
}


export const threeDotAfterText = (text, length) => {
  if (text != undefined) {
    return text.substring(0, length) + '...'
  }
}