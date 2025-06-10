import { format } from "date-fns";

export function formatTime(date: Date | string) {
    return format(date, `HH:mm`)
}

export function getHoursWIB(date: Date | string) {
    return new Date(date).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', hour: 'numeric' })
}