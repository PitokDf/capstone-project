'use client'

import { Card, CardContent } from "@/components/ui/card"

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"]
const times = ["07:00", "08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00"]

// Contoh data jadwal
const schedule = [
    { day: "Senin", time: "08:00", matkul: "Struktur Data", dosen: "Bu Sari", ruang: "R1" },
    { day: "Rabu", time: "10:00", matkul: "Algoritma", dosen: "Pak Budi", ruang: "R3" },
    { day: "Jumat", time: "13:00", matkul: "Basis Data", dosen: "Pak Anwar", ruang: "Lab 1" },
]

export default function ScheduleTable() {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border border-border text-sm">
                <thead>
                    <tr>
                        <th className="border border-border p-2 w-24 bg-muted">Jam</th>
                        {days.map((day) => (
                            <th key={day} className="border border-border p-2 bg-muted">{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {times.map((time) => (
                        <tr key={time}>
                            <td className="border border-border p-2 font-medium">{time}</td>
                            {days.map((day) => {
                                const slot = schedule.find(j => j.day === day && j.time === time)
                                return (
                                    <td key={day} className="border border-border p-2 h-20 align-top">
                                        {slot ? (
                                            <Card className="bg-primary text-primary-foreground shadow-sm">
                                                <CardContent className="p-2">
                                                    <div className="font-semibold">{slot.matkul}</div>
                                                    <div className="text-xs">{slot.dosen}</div>
                                                    <div className="text-xs">{slot.ruang}</div>
                                                </CardContent>
                                            </Card>
                                        ) : null}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
