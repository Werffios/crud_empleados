import pg from 'pg';

export const pool = new pg.Pool({
    user: "root",
    host: "192.168.1.189",
    password: "asjnlksacdeacse",
    database: "konecta",
    port: 16252,
})

