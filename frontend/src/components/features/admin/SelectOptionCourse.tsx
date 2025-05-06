import { FormControl } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCourses } from "@/lib/api/course"
import { useQuery } from "@tanstack/react-query"

type SelectOptionCourseProps = {
    onValueChange: any
    defaultValue: any
}


export function SelectOptionCourse({
    defaultValue, onValueChange
}: SelectOptionCourseProps) {
    const { data, isPending } = useQuery({
        queryKey: ["courses"],
        queryFn: getCourses
    })
    return (
        <Select
            onValueChange={onValueChange}
            defaultValue={defaultValue}
        >
            <FormControl>
                <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                </SelectTrigger>
            </FormControl>
            <SelectContent>
                {isPending ? (
                    <div className="px-3">Loading...</div>
                ) : (
                    <>
                        {data?.map((course) => (
                            <SelectItem key={course.id} value={course.id.toString()}>
                                {course.code} - {course.name}
                            </SelectItem>
                        ))}
                    </>
                )}
            </SelectContent>
        </Select>
    )
}