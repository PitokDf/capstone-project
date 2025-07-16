# Proyek Capstone: Penjadwalan Mata Kuliah Otomatis

Aplikasi web penjadwalan mata kuliah otomatis yang dibangun dengan backend Node.js (Express, TypeScript, Prisma) dan frontend Next.js (TypeScript). Aplikasi ini menggunakan Docker untuk mempermudah proses deployment dan pengembangan.

## Fitur Utama

- **Manajemen Data Master**: Kelola data dosen, mata kuliah, kelas, ruangan, dan slot waktu.
- **Pembuatan Jadwal Otomatis**: Menghasilkan jadwal perkuliahan secara otomatis menggunakan algoritma backtracking.
- **Antarmuka Modern**: Antarmuka yang bersih dan responsif dibangun dengan Next.js dan Shadcn/UI.
- **Kontainerisasi**: Mudah dijalankan dan di-deploy menggunakan Docker.

## Prasyarat

Pastikan perangkat Anda telah terinstal perangkat lunak berikut:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/) (v20.x atau lebih tinggi)
- [Docker](https://www.docker.com/products/docker-desktop/) dan Docker Compose

## 🚀 Instalasi (Menggunakan Docker - Direkomendasikan)

Ini adalah cara termudah dan tercepat untuk menjalankan proyek.

1.  **Clone repository ini:**

    ```bash
    git clone https://github.com/PitokDf/capstone-project.git
    cd capstone-project
    ```

2.  **Jalankan dengan Docker Compose:**
    Perintah ini akan membangun image untuk backend dan frontend, serta menjalankan kontainer untuk database, backend, dan frontend.

    ```bash
    docker-compose up -d --build
    ```

3.  **Inisialisasi dan Seeding Database:**
    Setelah kontainer berjalan, jalankan perintah berikut untuk membuat skema database dan mengisi data awal (seed).

    ```bash
    docker-compose exec backend npx prisma migrate dev --name init
    docker-compose exec backend npx prisma db seed
    ```

4.  **Selesai!**
    - Frontend dapat diakses di: `http://localhost:5000`
    - Backend API berjalan di: `http://localhost:4000`

## 🛠️ Instalasi Lokal (Tanpa Docker)

Jika Anda tidak ingin menggunakan Docker, ikuti langkah-langkah berikut.

### Backend

1.  **Masuk ke direktori backend:**

    ```bash
    cd backend
    ```

2.  **Install dependensi:**

    ```bash
    npm install
    ```

3.  **Setup Database PostgreSQL:**
    Pastikan Anda memiliki server PostgreSQL yang sedang berjalan.

4.  **Buat file `.env`:**
    Salin isi dari `.env.example` (jika ada) atau buat file `.env` baru di dalam direktori `backend/` dengan isi berikut. Sesuaikan dengan konfigurasi database Anda.

    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
    PORT=4000
    JWT_SECREET="RAHASIA_ANDA_DISINI"
    CLIENT_URL="http://localhost:5000"
    NODE_ENV=development
    ```

5.  **Jalankan Migrasi dan Seed Database:**

    ```bash
    npx prisma migrate dev --name init
    npx prisma db seed
    ```

6.  **Jalankan server backend:**
    ```bash
    npm run dev
    ```
    Server backend akan berjalan di `http://localhost:4000`.

### Frontend

1.  **Masuk ke direktori frontend:**

    ```bash
    cd ../frontend
    ```

2.  **Install dependensi:**

    ```bash
    npm install
    ```

3.  **Buat file `.env.local`:**
    Buat file `.env.local` di dalam direktori `frontend/` dengan isi berikut:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:4000/api
    ```

4.  **Jalankan server frontend:**
    ```bash
    npm run dev
    ```
    Server frontend akan berjalan di `http://localhost:5000`.

## 📜 Skrip yang Tersedia

### Backend (`/backend`)

- `npm run dev`: Menjalankan server pengembangan dengan hot-reloading.
- `npm run build`: Mengompilasi kode TypeScript ke JavaScript.
- `npm start`: Menjalankan server dari kode yang sudah di-build.
- `npx prisma migrate dev`: Menjalankan migrasi database.
- `npx prisma db seed`: Menjalankan proses seeding data.

### Frontend (`/frontend`)

- `npm run dev`: Menjalankan server pengembangan Next.js.
- `npm run build`: Membangun aplikasi untuk produksi.
- `npm start`: Menjalankan aplikasi produksi.
- `npm run lint`: Menjalankan linter.

---

## Dibuat Oleh

- **Nama**: Pito Desri Pauzi
- **NIM**: 2211083044
- **Jurusan**: TRPL (Teknologi Rekayasa Perangkat Lunak)
