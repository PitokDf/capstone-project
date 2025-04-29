import express, { Application } from "express";
import dotenv from "dotenv"
import authRoute from "./routes/auth.routes";
import lectureRoute from "./routes/lecture.routes";
import roomRouter from "./routes/room.routes";
import cors from "cors"
import courseRouter from "./routes/course.routes";
import morgan from "morgan"
import cookieParser from "cookie-parser";

dotenv.config() // agar .env bisa terbaca

const app: Application = express() // instance dari express
const port = process.env.PORT || 2000 // port

app.use(cors({
    origin: ["http://10.126.24.19:3000", process.env.CLIENT_URL!], // url frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // method yang diijinkan
    credentials: true, // agar bisa mengakses cookie dari frontend
}))
app.use(cookieParser()) // agar cookie bisa terbaca
app.use(express.json()) // parse request json agar dapat diproses
app.use(morgan('dev'))

// routers
app.use("/auth", authRoute);
app.use("/lecture", lectureRoute);
app.use("/room", roomRouter);
app.use("/course", courseRouter);

app.use("/", (req, res) => { return res.status(200).send("wellcome to API Penjadwalan mata kuliah") })

// jika user memasukkan path yang tidak tersedia pada routers
app.use((req, res) => {
    return res.status(404).json({ message: "Halaman tidak ditemukan." })
})

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})