'use client'

import ScheduleGrid from "@/components/ScheduleGrid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Printer } from "lucide-react"

export default function SchedulePage() {
  const [filter, setFilter] = useState("")

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">📅 Jadwal Perkuliahan</h1>
          <p className="text-sm text-muted-foreground">
            Halaman ini menampilkan hasil penjadwalan otomatis dari sistem.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Input
            placeholder="Cari berdasarkan kelas / prodi..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Button onClick={handlePrint} variant="outline">
            <Printer className="h-4 w-4 mr-2" /> Cetak
          </Button>
        </div>
      </div>

      {/* Tabel atau Grid jadwal */}
      <ScheduleGrid filter={filter} />
    </div>
  )
}
