import { FormControl } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCourses } from "@/lib/api/course"
import { getRooms } from "@/lib/api/room"
import { useQuery } from "@tanstack/react-query"

type SelectOptionProps = {
    onValueChange: any
    defaultValue: any
}


export function SelectOptionRoom({
    defaultValue, onValueChange
}: SelectOptionProps) {
    const { data, isPending } = useQuery({
        queryKey: ["rooms"],
        queryFn: getRooms
    })
    return (
        <Select
            onValueChange={onValueChange}
            defaultValue={defaultValue}
        >
            <FormControl>
                <SelectTrigger>
                    <SelectValue placeholder="Select a room" />
                </SelectTrigger>
            </FormControl>
            <SelectContent>
                {isPending ? (
                    <div className="px-3">Loading...</div>
                ) : (
                    <>
                        {data?.map((room) => (
                            <SelectItem key={room.id} value={room.id.toString()}>
                                {room.code} - {room.name}
                            </SelectItem>
                        ))}
                    </>
                )}
            </SelectContent>
        </Select>
    )
}