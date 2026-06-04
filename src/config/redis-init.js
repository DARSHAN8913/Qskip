import pool from "../models/db.js";
import redis from "./redis.js";

export async function initializeRedis() {

    const exists = await redis.exists("qskip:config");

    if (!exists) {
        await redis.hSet("qskip:config", {  
            version: "1.0.0",
            initialized_at: Date.now()
        });
    }
    console.log(
        "Redis config done and value:",
        await redis.hGet("qskip:config", "version")
    );
}

export const REDIS_KEYS = {
    USER:(id)=>`qskip:user:${user.id}`,
    QUEUE_CONFIRMED: (id) => `qskip:queue_entries _of_q${id}_is_confirmed`,
    QUEUE_WAITING: (id) => `qskip:queue_entries _of_q${id}_is_waiting`,
    QUEUE_META: (id) => `qskip:queues:${id}:meta`
};

export async function importToRedis() {

    const [users] = await pool.execute(`
        SELECT *
        FROM users
    `);

    for (const user of users) {

        await redis.hSet(
            `qskip:user:${user.id}`,
            {
                id: String(user.id),
                name: user.name,
                email: user.email || ""
            }
        );

    }

    const [queues] = await pool.execute(`
        SELECT *
        FROM queues
    `);

    for (const queue of queues) {

        await redis.hSet(
            `qskip:queues:${queue.id}`,
            {
                id: String(queue.id),
                queue_name: queue.queue_name,
                capacity: String(queue.capacity),
                is_active: String(queue.is_active)
            }
        );

    }

    console.log("Redis import completed");

}


export async function verifyRedisImport() {

    const [userRows] = await pool.execute(`
        SELECT COUNT(*) count
        FROM users
    `);

    const [queueRows] = await pool.execute(`
        SELECT COUNT(*) count
        FROM queues
    `);

    const mysqlUsers = Number(userRows[0].count);
    const mysqlQueues = Number(queueRows[0].count);

    const userKeys = await redis.keys("qskip:user:*");
    const queueKeys = await redis.keys("qskip:queues:*");

    const redisUsers = userKeys.length;
    const redisQueues = queueKeys.length;

    console.log("\n===== IMPORT VERIFICATION =====");

    console.log(
        "USERS",
        mysqlUsers === redisUsers ? "✓" : "✗",
        `MYSQL=${mysqlUsers}`,
        `REDIS=${redisUsers}`
    );

    console.log(
        "QUEUES",
        mysqlQueues === redisQueues ? "✓" : "✗",
        `MYSQL=${mysqlQueues}`,
        `REDIS=${redisQueues}`
    );

    console.log("===============================\n");

    return {
        usersMatch: mysqlUsers === redisUsers,
        queuesMatch: mysqlQueues === redisQueues,
        mysqlUsers,
        redisUsers,
        mysqlQueues,
        redisQueues
    };
}