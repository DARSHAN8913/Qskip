import pool from "./db.js";

export async function seedData_Mysql() {

    const [userCount] = await pool.execute(
        "SELECT COUNT(*) count FROM users"
    );

    if (userCount[0].count === 0) {

        const values = [];

        for (let i = 1; i <= 1000; i++) {

            values.push([
                `User_${i}`,
                `user-${i}@test.com`
            ]);

        }

        await pool.query(
            "INSERT INTO users(name,email) VALUES ?",
            [values]
        );

        console.log("1000 users inserted");
    }

    const [queueCount] = await pool.execute(
        "SELECT COUNT(*) count FROM queues"
    );

    if (queueCount[0].count === 0) {

        await pool.execute(`
            INSERT INTO queues
            (queue_name,capacity)
            VALUES
            ('Passport Verification',100),
            ('Driving License',100),
            ('Railway Counter',100),
            ('Bank Service',100),
            ('Hospital OPD',100)
        `);

        console.log("5 queues inserted");
    }

}
await seedData_Mysql();