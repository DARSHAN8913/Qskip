import pool from "../models/db.js";

export async function insertQueueEntry(data) {

    await pool.execute(
        `
        INSERT INTO queue_entries
        (
            queue_id,
            user_id,
            status,
            position_no,
            booked_at,
            req_at
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            FROM_UNIXTIME(? / 1000),
            FROM_UNIXTIME(? / 1000)
        )
        `,
        [
            data.queueId,
            data.userId,
            data.status,
            data.positionNo,
            data.bookedAt,
            data.reqAt
        ]
    );

}