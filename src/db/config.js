const pg = require("pg");
const { Pool, types } = pg;
const dotenv = require("dotenv");
dotenv.config();

let localPoolConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
};
console.log(localPoolConfig);

types.setTypeParser(1700, function (val) {
  return parseFloat(val);
});

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : localPoolConfig;

const pool = new Pool(poolConfig);
pool.on("connection", (connection) => {
  console.log("connected to database", connection);
});

module.exports = pool;
