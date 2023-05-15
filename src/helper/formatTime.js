// function to append AM or PM to time string
// Example 05:00 - 06:00 => 05:00 AM to 06:00 AM

export const formatTime = (time = "05:00 - 06:00") => {

    const [first, second] = time.split('-');
    const [firstHour, firstMinute] = first.split(':');
    const [secondHour, secondMinute] = second.split(':');
    const firstHourInt = parseInt(firstHour);
    const secondHourInt = parseInt(secondHour);
    const firstMinuteInt = parseInt(firstMinute);
    const secondMinuteInt = parseInt(secondMinute);
    const firstHourString = firstHourInt > 12 ? `${firstHourInt - 12}` : firstHourInt;
    const secondHourString = secondHourInt > 12 ? `${secondHourInt - 12}` : secondHourInt;
    const firstMinuteString = firstMinuteInt === 0 ? '00' : firstMinuteInt;
    const secondMinuteString = secondMinuteInt === 0 ? '00' : secondMinuteInt;
    const firstAMPM = firstHourInt > 12 ? 'PM' : 'AM';
    const secondAMPM = secondHourInt > 12 ? 'PM' : 'AM';
    return `${firstHourString}:${firstMinuteString} ${firstAMPM} to ${secondHourString}:${secondMinuteString} ${secondAMPM}`;
}

