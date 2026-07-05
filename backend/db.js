const mysql = require('mysql2/promise'); // Uses promise version for async/await

// Configure the connection pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root90', // Matches the password you used in the terminal
  database: 'PulsePoint', // Matches the database name from your screenshots
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection immediately
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("Successfully connected to the PulsePoint database.");
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
})();

module.exports = db;