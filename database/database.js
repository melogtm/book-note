import "dotenv/config"; 
import pkg from "pg";

const {Pool} = pkg;

// Creating Pool for Db connections 
const dbPool = new Pool({
    user: process.env.DB_USER, 
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: 5432
});

// Creating queries for Pool
export default async function query(qstring, params) {
    const dbClient = await dbPool.connect();  
    try {
        return dbClient.query(qstring, params); 
    } finally {
        dbClient.release(); 
    }
}
