import pool from "./db.js";

export async function schema() {
    await pool.execute(`
        CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
        `);

    await pool.execute(`
        CREATE TABLE IF NOT EXISTS queues (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        queue_name VARCHAR(255) NOT NULL,
        capacity INT NOT NULL,
        is_active TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS queue_entries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    queue_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,

    status VARCHAR(20) DEFAULT '' ,
    position_no INT DEFAULT NULL,
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    req_at TIMESTAMP DEFAULT NULL,

    UNIQUE(queue_id,user_id),
    FOREIGN KEY (queue_id) REFERENCES queues(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
    );
        `);
};
