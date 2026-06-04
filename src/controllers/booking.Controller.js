import { insertQueueEntry } from "../models/booking.Model.js";
import pool from "../models/db.js";
import { bookUser } from "../utils/repo.js";
import { Router } from "express";
let FLUSH_MODE = "SYNC";

const bookingBuffer = [];
export let BookingRouter = Router();

BookingRouter.post("/book-one",book);
export async function book(req, res) {

    try {

        const {
            queueId,
            userId,
            reqAt
        } = req.body;

        const [queues] = await pool.execute(
            `
            SELECT capacity
            FROM queues
            WHERE id=?
            `,
            [queueId]
        );

        if (queues.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Queue not found"
            });

        }

        const capacity =
            queues[0].capacity;

        const bookingResult =
            await bookUser(
                queueId,
                userId,
                capacity,
                reqAt
            );

        if (
            bookingResult.status ===
            "ALREADY_BOOKED"
        ) {

            return res.status(409).json({
                success: false,
                status:
                    bookingResult.existingState,
                message:
                    "Already booked"
            });

        }

        const row = {
            queueId,
            userId,
            status: bookingResult.status,
            positionNo: bookingResult.positionNo,
            bookedAt: bookingResult.bookedAt,
            reqAt
        };

        if (FLUSH_MODE === "SYNC") {

            await insertQueueEntry(row);

        } 

        return res.status(200).json({
            success: true,

            status:
                bookingResult.status,

            positionNo:
                bookingResult.positionNo,

            bookedAt:
                bookingResult.bookedAt,

            flushMode:
                FLUSH_MODE
        });

    } catch (err) {

        console.error("ERR In book: ",err);

        return res.status(500).json({
            success: false,
            message:
                "Internal Server Error"
        });

    }

};
/*
POST /queue/book

{
    "queueId":1,
    "userId":101,
    "reqAt":1749100000000
}
*/