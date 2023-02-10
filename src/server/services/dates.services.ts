import { endOfMonth, endOfWeek, startOfMonth, startOfWeek, endOfDay, startOfDay, addMonths } from "date-fns";

export class DatesServices {
    static getDatesRange({ queryBy, startDate, endDate }: { queryBy?: string, startDate?: Date, endDate?: Date }) {
        const dateChange = queryBy === "daily" && startDate || queryBy === "monthly" && startDate
        const date = dateChange ? startDate : new Date()
        let parseDateStart
        let parseDateEnd

        if (queryBy === "daily") {
            //@ts-ignore
            parseDateStart = startOfDay(date)
            //@ts-ignore
            parseDateEnd = endOfDay(date)
        }

        if (queryBy === "weekly") {
            //@ts-ignore
            parseDateStart = startOfWeek(date)
            //@ts-ignore
            parseDateEnd = endOfWeek(date)
        }

        if (queryBy === "monthly") {
            //@ts-ignore
            parseDateStart = startOfMonth(date)
            //@ts-ignore
            parseDateEnd = endOfMonth(date)
        }

        if (queryBy === "range") {
            //@ts-ignore
            parseDateStart = startOfDay(startDate!)
            //@ts-ignore
            parseDateEnd = endOfDay(endDate!)
        }
        return { parseDateStart, parseDateEnd }
    }
    static addMonthToDate(date: Date, month: number) {
        const newDate = new Date(date)
        return addMonths(newDate, month)
    }
    static startOfMonth(date: Date) {
        return startOfMonth(date)
    }
}