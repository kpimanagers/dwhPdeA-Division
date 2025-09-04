require('dotenv').config();
const mysql = require("mysql2/promise");

const createConection = async (retryCount = 0) => {
  try {
    const pool = mysql.createPool({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      port: Number(process.env.PORT),
      multipleStatements: true,
      connectionLimit: 10,
    });
    const poolConn = await pool.getConnection();
    return poolConn;
  } catch (error) {
    console.error(error);
    if (retryCount < 3) {
      console.log(`Retrying connection (${retryCount + 1})...`);
      return createConection(retryCount + 1);
    } else {
      console.error("Failed to connect after 3 attempts");
    }
  }
};

module.exports = createConection;

