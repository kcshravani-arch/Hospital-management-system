const db = require('./db');

(async () => {
  try {
    const [rows] = await db.query('SHOW TABLES');
    console.log(rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
})();
