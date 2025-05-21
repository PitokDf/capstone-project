'use client'

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createTimeSlotToNext } from "@/lib/api/timeslot";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircleIcon, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function MoreAction() {
    const qc = useQueryClient()
    const timeslots = qc.getQueryData(["timeslots"]) as [{ day: string }]
    const day = timeslots?.map((item) => item.day)

    const [selectedDays, setSelectedDays] = useState<string[]>([])
    console.log(selectedDays);

    const handleSelectedDay = (day: string) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter((value) => value != day))
        } else {
            setSelectedDays([...selectedDays, day])
        }
    }

    const { mutateAsync, isPending } = useMutation({
        mutationFn: async () => {
            await createTimeSlotToNext(selectedDays)
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["timeslots"] }),
                toast.success("Berhasil menyalin slot waktu")
        },
        onError: () => {
            toast.success("Gagal menyalin slot waktu")
        }
    })
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"secondary"}
                    className='cursor-pointer'>
                    <MoreHorizontal />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-80'>
                <div className="grid gap-4">
                    <div className="space-y-1">
                        <h4 className="font-medium leading-none">Copy Time Slot</h4>
                        <p className="text-sm text-muted-foreground">
                            Salin slot waktu ke hari berikutnya.
                        </p>
                    </div>
                    <div className="grid gap-2 grid-cols-2">
                        {
                            DAYS.filter(dayitem => !day?.includes(dayitem)).map((day, index) => (
                                <div key={day + index} className={`px-3 py-2 rounded-md cursor-pointer flex justify-between items-center text-sm 
                                    ${selectedDays.includes(day) ?
                                        "bg-primary text-primary-foreground" :
                                        "bg-secondary hover:bg-secondary/80"} `}
                                    onClick={() => { handleSelectedDay(day) }}>
                                    <span>{day}</span>
                                    <CheckCircleIcon className={`w-4 h-4 ${selectedDays.includes(day) ? "text-green-600" : "text-gray-500"} `} />
                                </div>
                            ))
                        }
                    </div>
                    <div className="border-t-2 flex justify-end pt-2">
                        <Button
                            onClick={() => { mutateAsync() }}
                            disabled={selectedDays.length === 0 || isPending}
                            size={"sm"}
                            className="bg-gradient-to-r from-amber-500 to-red-500 text-white cursor-pointer">
                            {isPending ? "Copying..." : "Copy"}
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}