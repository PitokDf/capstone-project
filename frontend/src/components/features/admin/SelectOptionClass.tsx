import { FormControl } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getClasses } from "@/lib/api/class"
import { getTimeslots } from "@/lib/api/timeslot"
import { formatTime } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"

type SelectOptionProps = {
    onValueChange: any
    defaultValue: any
}


export function SelectOptionClass({
    defaultValue, onValueChange
}: SelectOptionProps) {
    const { data, isPending } = useQuery({
        queryKey: ["classes"],
        queryFn: getClasses
    })
    return (
        <Select
            onValueChange={onValueChange}
            defaultValue={defaultValue}
        >
            <FormControl>
                <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                </SelectTrigger>
            </FormControl>
            <SelectContent>
                {isPending ? (
                    <div className="px-3">Loading...</div>
                ) : (
                    <>
                        {data?.map((classes) => (
                            <SelectItem key={classes.id} value={classes.id.toString()}>
                                {classes.name}
                            </SelectItem>
                        ))}
                    </>
                )}
            </SelectContent>
        </Select>
    )
}