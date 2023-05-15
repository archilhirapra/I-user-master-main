import { format } from "date-fns"

/**
 * @param  {} dateString - date string ( DD/MM/YYYY ) format
 * @param  {} formatString - format string input ( https://date-fns.org/v2.21.3/docs/format )
 */
export const getInitialsFromDate = (dateString = new Date(), formatString = 'LLLL, dd, yyyy') => {

    // convert DD/MM/YYYY to Date Object
    let dateObject
    if (String(dateString).includes('/')) {
        const dateParts = dateString.split("/")
        dateObject = new Date(+dateParts[2], dateParts[0] - 1, +dateParts[1])
        return format(new Date(dateObject), formatString)
    }
    else {
        return format(dateString, formatString)
    }
    // formatString =  "MMM" returns "Jan"
    // formatString =  "dd" returns "01"
    // formatString =  "EEEE" returns "Monday"
}

