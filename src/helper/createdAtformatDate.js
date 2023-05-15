import { format } from "date-fns"
import { formatTime } from "./formatTime"

/**
 * @param  {} dateString - date string ( DD/MM/YYYY ) format
 * @param  {} formatString - format string input ( https://date-fns.org/v2.21.3/docs/format )
 */
export const createdAtFromDate = (dateString = new Date(), formatString = 'LLLL, dd, yyyy') => {

    const dateParts = dateString.split(" ")
    const firstPart = dateParts[0]
    const secondPart = dateParts[1]
    const divideFirstPart = firstPart.split("-")

    const dateFirstObject = new Date(+divideFirstPart[2], divideFirstPart[1] - 1, +divideFirstPart[0])

    return format(new Date(dateFirstObject), formatString) + ' (' + (secondPart)+')'

}

