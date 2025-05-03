import NotFoundClient from "@/components/errors/NotFoundClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Halaman Tidak Ditemukan',
    description: 'Halaman yang kamu cari tidak ditemukan.'
}


export default function NotFound() {
    return (
        <NotFoundClient />
    )
}