import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";

interface ResourecSummaryProps {
    title: string;
    value: string;
    description: string;
    trend?: 'increase' | 'decrease' | 'neutral';
}

export function ResourceSummary({ title, value, description, trend = "neutral" }: ResourecSummaryProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {trend === "increase" && (
                    <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
                )}
                {trend === "decrease" && (
                    <ArrowDownIcon className="h-4 w-4 text-rose-500" />
                )}
                {trend === "neutral" && (
                    <MinusIcon className="h-4 w-4 text-muted-foreground" />
                )}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground pt-1">{description}</p>
            </CardContent>
        </Card>
    )
}