import { FormControl } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getTimeslots } from "@/lib/api/timeslot"
import { formatTime } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"

type SelectOptionProps = {
    onValueChange: any
    defaultValue: any
}


export function SelectOptionTimeslot({
    defaultValue, onValueChange
}: SelectOptionProps) {
    const { data, isPending } = useQuery({
        queryKey: ["timeslots"],
        queryFn: getTimeslots
    })
    return (
        <Select
            onValueChange={onValueChange}
            defaultValue={defaultValue}
        >
            <FormControl>
                <SelectTrigger>
                    <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
            </FormControl>
            <SelectContent>
                {isPending ? (
                    <div className="px-3">Loading...</div>
                ) : (
                    <>
                        {data?.map((timeSlot) => (
                            <SelectItem key={timeSlot.id} value={timeSlot.id.toString()}>
                                {timeSlot.day}, {formatTime(timeSlot.starTime)} - {formatTime(timeSlot.endTime)}
                            </SelectItem>
                        ))}
                    </>
                )}
            </SelectContent>
        </Select>
    )
}