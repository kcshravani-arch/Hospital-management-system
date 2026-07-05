const db = require('./db');

(async () => {
  try {
    const [rows] = await db.query('SHOW COLUMNS FROM appointments');
    console.log(rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
})();
