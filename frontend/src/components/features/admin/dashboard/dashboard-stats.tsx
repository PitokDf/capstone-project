"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScheduleChart } from "./ScheduleChart";

const data = [
  { name: "Monday", value: 15 },
  { name: "Tuesday", value: 18 },
  { name: "Wednesday", value: 20 },
  { name: "Thursday", value: 16 },
  { name: "Friday", value: 12 },
];

export const COLORS = [
  "#3B82F6", // Blue-500
  "#10B981", // Emerald-500
  "#F59E0B", // Amber-500
  "#EF4444", // Red-500
  "#8B5CF6", // Violet-500
  "#0EA5E9", // Sky-500
  "#F472B6", // Pink-400
  "#22D3EE", // Cyan-400
];


export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ScheduleChart />
      <Card>
        <CardHeader>
          <CardTitle>Room Utilization</CardTitle>
          <CardDescription>
            Percentage of rooms by utilization level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: '80-100%', value: 12 },
                    { name: '60-80%', value: 18 },
                    { name: '40-60%', value: 10 },
                    { name: '20-40%', value: 5 },
                    { name: '0-20%', value: 3 }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={true}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: `${COLORS[2]}`,
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}