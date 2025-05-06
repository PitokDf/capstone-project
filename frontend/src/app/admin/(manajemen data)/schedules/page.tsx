"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCog, CalendarDays, Wand2, Settings2 } from "lucide-react";
import { WeeklySchedule } from '@/components/features/admin/dashboard/WeeklySchedule';
import { Card, CardContent } from '@/components/ui/card';
import { ScheduleTable } from '@/components/features/admin/schedule/ScheduleTable';
import { AddSchedule } from '@/components/features/admin/schedule/AddSchedule';
import { EditSchedule } from '@/components/features/admin/schedule/EditSchedule';
import { Schedule } from '@/types/schedule';
import { DeleteSchedule } from '@/components/features/admin/schedule/DeleteSchedule';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { GenerateButton } from '@/components/features/admin/schedule/GenerateButton';



export default function SchedulesPage() {
    const [activeTab, setActiveTab] = useState('list');
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const openEditDialog = (schedule: Schedule) => {
        setCurrentSchedule(schedule);
        console.log(schedule);

        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (schedule: Schedule) => {
        setCurrentSchedule(schedule);
        setIsDeleteDialogOpen(true);
    };


    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Schedules</h1>
                <div className="flex gap-2">
                    <GenerateButton />
                    <AddSchedule />
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="list">
                        <FileCog className="mr-2 h-4 w-4" />
                        List View
                    </TabsTrigger>
                    <TabsTrigger value="calendar">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Calendar View
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                    <Card>
                        <CardContent>
                            <ScheduleTable
                                onDelete={openDeleteDialog}
                                onEdit={openEditDialog}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="calendar">
                    <WeeklySchedule filterType='' filterValue='' />
                </TabsContent>
            </Tabs>

            {
                isDeleteDialogOpen && currentSchedule && (
                    <DeleteSchedule
                        data={currentSchedule}
                        onOpenChange={setIsDeleteDialogOpen}
                        open={isDeleteDialogOpen}
                    />
                )
            }

            {
                isEditDialogOpen && currentSchedule && (
                    <EditSchedule
                        data={currentSchedule as any}
                        onOpenChange={setIsEditDialogOpen}
                        open={isEditDialogOpen}
                    />
                )
            }
        </div>
    );
}