import express  from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({path:[ 
    './.env',
    './.env.dev',
    './.env.test',
    './.env.staging',
    './.env.production',
  ]});


const app = express(); 
app.use(cors({
    origin:process.env.CORS_ORIGIN??"*",
    credentials:true
}));
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(cookieParser());

// Router part:

import { BookingRouter } from "./controllers/booking.Controller.js";
import { RedisExplorerRouter } from "./controllers/redis-gui.js";
import { LoadTestRouter } from "../tests/Performance.Controller.js";

app.use( "/redis-explorer", RedisExplorerRouter );
app.use("/booking",BookingRouter);
app.use("/api/loadtest",LoadTestRouter)
import client from "prom-client";

const register =
    new client.Registry();

client.collectDefaultMetrics({
    register
});

app.get(
    "/metrics",
    async ( req, res ) => {

        res.set(
            "Content-Type",
            register.contentType
        );

        res.end(
            await register.metrics()
        );

    }
);

export default app;