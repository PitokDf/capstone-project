import express, { Application } from "express";
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser";
import apiRouter from "./routes/index.routes";

dotenv.config() // agar .env bisa terbaca

const app: Application = express() // instance dari express
const port = process.env.PORT || 2000 // port

app.use(cors({
    origin: ['https://capstone-project-rosy-seven.vercel.app', process.env.CLIENT_URL!], // url frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // method yang diijinkan
    credentials: true, // agar bisa mengakses cookie dari frontend,
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}))

app.set('trust proxy', 1)

app.use(cookieParser()) // agar cookie bisa terbaca
app.use(express.json()) // parse request json agar dapat diproses
app.use(morgan('dev')) // menampilkan log request url

// routes
app.use("/api", apiRouter)

app.get("/", (req, res) => { return res.status(200).send("wellcome to API Penjadwalan mata kuliah") })

// jika user memasukkan path yang tidak tersedia pada routers
app.use((req, res) => {
    return res.status(404).json({ message: "Routing tidak ditemukan." })
})

app.listen(port, () => {
    console.log(`server running on port ${port}`);
})