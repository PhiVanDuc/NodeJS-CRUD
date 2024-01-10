const sql = require("../utils/db");

module.exports = {
    all: (status, keyword) => {
        let filter = sql`WHERE name IS NOT NULL`;

        if (status === "active" || status === "inactive") {
            filter = sql`${ filter } AND status=${ status === "active" }`;
        }

        if (keyword) {
            filter = sql`${ filter } AND LOWER(email) LIKE ${
                "%" + keyword.toLowerCase() + "%"
            }`;
        }
        
        return sql`SELECT * FROM users ${ filter }`;
    },

    getEmail: (email) => {
        return sql`SELECT email FROM users WHERE email=${email}`;
    },

    add: (data) => {
        return sql`INSERT INTO users (name, email, password, status)
        VALUES (${data.name}, ${data.email}, NULL, ${+data.status})`
    }
}


/*
    1. Không lọc
    SELECT * FROM users

    2. Lọc theo status
    SELECT * FROM users WHERE status=${status}

    3. Lọc theo keyword
    SELECT * FROM users WHERE email LIKE '%${keyword}%'

    4. Lọc theo cả status và keyword
    SELECT * FROM users WHERE status=${status} AND email LIKE '%${keyword}%'


    Giải pháp:

    1. Không lọc
    SELECT * FROM users WHERE name IS NOT NULL

    2. Lọc theo status
    SELECT * FROM users WHERE name IS NOT NULL AND status=${status}

    3. Lọc theo keyword
    SELECT * FROM users WHERE name IS NOT NULL AND email LIKE '%${keyword}%'

    4. Lọc theo cả 2
    SELECT * FROM users WHERE name IS NOT NULL AND status=${status} AND email LIKE '%${keyword}%'
*/