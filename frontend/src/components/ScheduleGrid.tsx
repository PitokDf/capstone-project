'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion } from "framer-motion"

type JadwalItem = {
    id: string
    matkul: string
    dosen: string
    kelas: string
    prodi: string
    hari: string
    jam: string
    ruang: string
}

const mockData: JadwalItem[] = [
    {
        id: "1",
        matkul: "Pemrograman Web",
        dosen: "Budi Santoso",
        kelas: "TI-1A",
        prodi: "Teknik Informatika",
        hari: "Senin",
        jam: "08:00 - 10:00",
        ruang: "Lab A",
    },
    {
        id: "2",
        matkul: "Basis Data",
        dosen: "Siti Aminah",
        kelas: "TI-1B",
        prodi: "Teknik Informatika",
        hari: "Selasa",
        jam: "10:00 - 12:00",
        ruang: "Lab B",
    },
    // Tambah data dummy lainnya kalau perlu
]

export default function ScheduleGrid({ filter }: { filter: string }) {
    const filtered = mockData.filter((item) =>
        item.kelas.toLowerCase().includes(filter.toLowerCase()) ||
        item.prodi.toLowerCase().includes(filter.toLowerCase())
    )

    return (
        <motion.div
            className="overflow-x-auto rounded-xl border shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Mata Kuliah</TableHead>
                        <TableHead>Dosen</TableHead>
                        <TableHead>Kelas</TableHead>
                        <TableHead>Prodi</TableHead>
                        <TableHead>Hari</TableHead>
                        <TableHead>Jam</TableHead>
                        <TableHead>Ruangan</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filtered.length > 0 ? (
                        filtered.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.matkul}</TableCell>
                                <TableCell>{item.dosen}</TableCell>
                                <TableCell>{item.kelas}</TableCell>
                                <TableCell>{item.prodi}</TableCell>
                                <TableCell>{item.hari}</TableCell>
                                <TableCell>{item.jam}</TableCell>
                                <TableCell>{item.ruang}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground">
                                Tidak ada jadwal ditemukan.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </motion.div>
    )
}
