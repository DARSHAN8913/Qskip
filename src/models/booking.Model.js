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

import redis from "../config/redis.js";
import { upsertQueueEntries } from "../models/queue.Model.js";
import { REDIS_KEYS } from "../config/redis-init.js";

const flushState = new Map();

export async function flushConfirmedQueue( queueId ) {
    
    if ( flushState.get(queueId) )  return;

    flushState.set( queueId, true );

    try {
        const entries = await redis.lRange( REDIS_KEYS.QUEUE_CONFIRMED( queueId ),0,  -1 );
        
        if ( entries.length === 0 )  return;

        const rows = [];

        for ( const item of entries ) {
            const parsed = JSON.parse(item);
            rows.push({
                queueId,
                userId: Number( parsed.user_id ),
                status:"CONFIRMED",
                positionNo: Number( parsed.position_no ),
                bookedAt: Number( parsed.booked_at ),
                reqAt: Number( parsed.req_at )
            });

        }

        await upsertQueueEntries( rows );
        console.log( `Queue ${queueId} flushed : ${rows.length}` );
        
    } finally {
        flushState.delete( queueId );
    }

};