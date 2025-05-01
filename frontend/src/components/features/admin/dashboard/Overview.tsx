"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
    {
        name: 'Monday',
        morning: 12,
        afternoon: 8,
        evening: 4,
    },
    {
        name: 'Tuesday',
        morning: 15,
        afternoon: 10,
        evening: 6,
    },
    {
        name: 'Wednesday',
        morning: 14,
        afternoon: 12,
        evening: 5,
    },
    {
        name: 'Thursday',
        morning: 10,
        afternoon: 8,
        evening: 3,
    },
    {
        name: 'Friday',
        morning: 8,
        afternoon: 6,
        evening: 2,
    },
];

export function Overview() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--border))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                        color: 'hsl(var(--card-foreground))',
                    }}
                />
                <Legend />
                <Bar dataKey="morning" name="Morning Sessions" fill="#8884d8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="afternoon" name="Afternoon Sessions" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                <Bar dataKey="evening" name="Evening Sessions" fill="#ffc658" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}