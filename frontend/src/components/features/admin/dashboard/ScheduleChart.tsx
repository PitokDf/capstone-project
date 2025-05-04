import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export function ScheduleChart() {
    const { data } = useQuery({
        queryFn: async () => {
            const res = await axiosInstance.get("/timeslot/stats")
            return res.data.data.statClasses as { name: string, value: number }[]
        },
        queryKey: ["stats"]
    })
    return (
        <Card>
            <CardHeader>
                <CardTitle>Classes by Day</CardTitle>
                <CardDescription>
                    Distribution of classes across weekdays
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" fill="#fff" />
                            <YAxis />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: `#000`,
                                    borderColor: `#00000f`,
                                    borderRadius: '0.5rem',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                                }}
                            />
                            <Bar dataKey="value" fill={COLORS[2]} radius={[4, 4, 0, 0]} >
                                {data?.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}