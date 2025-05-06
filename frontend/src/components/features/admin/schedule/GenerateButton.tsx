'use client'

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import axiosInstance from "@/lib/axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Settings2, Wand2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type options = {
    saveToDatabase?: boolean;
    clearExisting?: boolean;
    allowPartialResults?: boolean;

}

const defaultSettings = {
    saveToDatabase: true,
    clearExisting: false,
    allowPartialResults: false,
}
export function GenerateButton() {
    const [isGenerating, setIsGenerating] = useState(false)
    const [options, setOptions] = useState<options>(() => {
        const saved = typeof window !== "undefined" ? localStorage?.getItem("schedule_options") : null
        return saved ? JSON.parse(saved) : defaultSettings
    })
    const qc = useQueryClient()

    useEffect(() => {
        localStorage.setItem("schedule_options", JSON.stringify(options))
    }, [options])

    const handleToogle = (key: keyof typeof options) => {
        setOptions(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const { isPending, mutateAsync } = useMutation({
        mutationFn: async () => {
            await axiosInstance.post("/schedule/generate", { options })
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["schedules"] })
            toast.success("Jadwal berhasil dibuat.")
        },
        onError: (err) => {
            console.log(err);

        }
    })
    return (
        <div className='border rounded-md'>
            <Button
                variant="ghost"
                onClick={() => { mutateAsync() }}
                disabled={isPending}
            >
                <Wand2 className="mr-2 h-4 w-4" />
                {isPending ? "Generating..." : "Generate Schedule"}
            </Button>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"ghost"}
                        className='cursor-pointer hover:bg-card-foreground rounded-none'>
                        <Settings2 />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-80'>
                    <div className="grid gap-4">
                        <div className="space-y-1">
                            <h4 className="font-medium leading-none">Pengaturan Penjadwalan</h4>
                            <p className="text-sm text-muted-foreground">
                                Atur opsi untuk proses generate jadwal.
                            </p>
                        </div>
                        <div className="grid gap-3">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="saveToDatabase" className="text-sm">
                                    Simpan ke database
                                </Label>
                                <Switch
                                    id="saveToDatabase"
                                    defaultChecked={options.saveToDatabase}
                                    onCheckedChange={() => handleToogle('saveToDatabase')}
                                    checked={options.saveToDatabase}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="clearExisting" className="text-sm">
                                    Hapus Data Lama
                                </Label>
                                <Switch
                                    id="clearExisting"
                                    defaultChecked={options.clearExisting}
                                    onCheckedChange={() => handleToogle('clearExisting')}
                                    checked={options.clearExisting} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="allowPartialResults" className="text-sm">
                                    Izinkan Hasil Sebagian
                                </Label>
                                <Switch
                                    id="allowPartialResults"
                                    defaultChecked={options.allowPartialResults}
                                    onCheckedChange={() => handleToogle('allowPartialResults')}
                                    checked={options.allowPartialResults} />
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}