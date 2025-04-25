'use client'

import { getTimeslots } from "@/lib/api/timeslot";
import { useQuery } from "@tanstack/react-query";

export default function TimeslotsPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['timeslots'],
        queryFn: getTimeslots,
        staleTime: 1000 * 60 * 5
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    console.log(data);

    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Timeslots</h1>
            <p className="text-sm text-muted-foreground">
                Manage your timeslots here.
            </p>
            {/* Add your timeslot management components here */}
        </div>
    );
}