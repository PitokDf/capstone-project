import { FormControl } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getLectures } from "@/lib/api/lecture"
import { useQuery } from "@tanstack/react-query"

type SelectOptionLecturesProps = {
    onValueChange: any
    defaultValue: any
}


export function SelectOptionLecture({
    defaultValue, onValueChange
}: SelectOptionLecturesProps) {
    const { data, isPending } = useQuery({
        queryKey: ["lectures"],
        queryFn: getLectures
    })
    return (
        <Select
            onValueChange={onValueChange}
            defaultValue={defaultValue}
        >
            <FormControl>
                <SelectTrigger>
                    <SelectValue placeholder="Select a Lecture" />
                </SelectTrigger>
            </FormControl>
            <SelectContent>
                {isPending ? (
                    <div className="px-3">Loading...</div>
                ) : (
                    <>
                        {data?.map((lecture) => (
                            <SelectItem key={lecture.id} value={lecture.id.toString()}>
                                {lecture.name}
                            </SelectItem>
                        ))}
                    </>
                )}
            </SelectContent>
        </Select>
    )
}