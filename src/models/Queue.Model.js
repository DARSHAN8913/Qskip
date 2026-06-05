import pool from "./db.js";

export async function upsertQueueEntries(rows) {

    if (!rows.length) {
        return;
    }

    const placeholders = [];
    const params = [];

    for (const row of rows) {

        placeholders.push(
            "(?,?,?,?,?,?)"
        );

        params.push(
            row.queueId,
            row.userId,
            row.status,
            row.positionNo,
            new Date(Number(row.bookedAt)),
            new Date(Number(row.reqAt))
        );

    }

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
        ${placeholders.join(",")}

        ON DUPLICATE KEY UPDATE

            status = VALUES(status),
            position_no = VALUES(position_no),
            booked_at = VALUES(booked_at),
            req_at = VALUES(req_at)
        `,
        params
    );

}