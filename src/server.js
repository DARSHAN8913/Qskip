import app from "./app.js";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import db from "./models/db.js";
import express from "express";
import { schema } from "./models/auth.Model.js";


dotenv.config({path:[ 
    '../.env',
    '../.env.dev',
    '../.env.test',
    '../.env.staging',
    '../.env.production',
  ]});

try {
    let conn=await db.getConnection();
    conn.release();
    await schema();
    console.log("✅ MySQL Database Connected Successfully");
} catch (err) {
  console.error("❌ MySQL Connection Failed:", err);
  process.exit(1); // Stop server if DB fails
}

app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  });

  app.get('/', (req, res) =>
  res.send('🚀 Server is running and MySQL is connected ✅')
);
app.use(express.static("public"));

const port = process.env.PORT;
 app.listen(port,()=>{
  console.log("Listening on port: ",port);
 });