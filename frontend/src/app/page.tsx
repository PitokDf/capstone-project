import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CalendarDays, Users, BookOpen, MapPin } from 'lucide-react';
import { FeatureCard } from '@/components/ui/feature-card';
import Header from '@/components/layouts/Header';


export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header />
      <main className="py-16 max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">Sistem Penjadwalan Mata Kuliah</h2>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Platform komprehensif untuk mengelola dan melihat jadwal perkuliahan, dirancang untuk mengatur jadwal perkuliahan yang efisien..
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <FeatureCard
            icon={<CalendarDays className="h-8 w-8" />}
            title="Schedule Management"
            description="Kelola dan atur jadwal kursus secara efisien dengan antarmuka yang cerdas."
          />
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="Lecturer Management"
            description="Kelola dosen, preferensi, dan tugas mengajar."
          />
          <FeatureCard
            icon={<BookOpen className="h-8 w-8" />}
            title="Course Management"
            description="Mengatur rincian kursus, kredit, dan persyaratan penjadwalan."
          />
          <FeatureCard
            icon={<MapPin className="h-8 w-8" />}
            title="Room Allocation"
            description="Optimalkan penggunaan ruangan berdasarkan kapasitas, lokasi, dan kebutuhan kursus."
          />
        </div>

        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <Button size="lg" className="px-8" asChild>
            <Link href="/schedule">View Schedules</Link>
          </Button>
          <Button size="lg" variant="outline" className="px-8" asChild>
            <Link href="/admin">Admin Login</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}