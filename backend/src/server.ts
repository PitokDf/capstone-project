import express, { Application } from "express";
import dotenv from "dotenv"
import authRoute from "./routes/auth.routes";
import lectureRoute from "./routes/lecture.routes";
dotenv.config() // agar .env bisa terbaca

const app: Application = express() // instance dari express
const port = process.env.PORT || 2000 // port

app.use(express.json()) // parse request json agar dapat diproses

// routers
app.use("/auth", authRoute);
app.use("/lecture", lectureRoute);

// jika user memasukkan path yang tidak tersedia pada routers
app.use((req, res) => { return res.status(200).send("wellcome to API Penjadwalan mata kuliah") })


app.listen(port, () => {
    console.log(`server running on port ${port}`);
})