const db = require('./db');

(async () => {
  try {
    // Add status column if it doesn't exist
    await db.query(`
      ALTER TABLE appointments 
      ADD COLUMN status VARCHAR(50) DEFAULT 'Pending'
    `);
    console.log("Added 'status' column to appointments table.");
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log("Column 'status' already exists.");
    } else {
      console.error("Error:", err);
    }
  } finally {
    process.exit();
  }
})();
