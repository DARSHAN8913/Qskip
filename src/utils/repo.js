import { REDIS_KEYS } from "../config/redis-init.js";
import redis from "../config/redis.js";
import bookingLua from "./lua.js";

export async function bookUser(
    queueId,
    userId,
    capacity,
    reqAt
) {

    const bookedAt = Date.now();

    const result = await redis.eval(
        bookingLua,                         //const bookingLua = await fs.readFile(
                                            //     path.resolve("src/utils/booking.lua"),
                                            //     "utf8"
                                            // );
        {
            keys: [
                REDIS_KEYS.QUEUE_CONFIRMED(queueId),
                REDIS_KEYS.QUEUE_WAITING(queueId)
            ],
            arguments: [
                String(userId),
                String(capacity),
                String(reqAt),
                String(bookedAt)
            ]
        }
    );

    return {
        status: result[0],
        positionNo: result[1]
            ? Number(result[1])
            : null,
        bookedAt: result[2]
            ? Number(result[2])
            : null,
        existingState: result[1] === "CONFIRMED" ||
                       result[1] === "WAITING"
            ? result[1]
            : null
    };
}