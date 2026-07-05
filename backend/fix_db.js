const db = require('./db');

(async () => {
  try {
    await db.query('DROP TABLE IF EXISTS appointments');
    console.log("Dropped old appointments table");

    await db.query(`
      CREATE TABLE appointments (
        id VARCHAR(20) PRIMARY KEY,
        time VARCHAR(20) NOT NULL,
        doctor VARCHAR(100) NOT NULL,
        patient VARCHAR(100) NOT NULL,
        reason VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending'
      )
    `);
    console.log("Created new appointments table");

    await db.query(`
      INSERT INTO appointments (id, time, doctor, patient, reason, status) VALUES
      ('APT-001', '09:15 AM', 'Dr. Gregory House', 'Alice Brown', 'Cardiac Checkup', 'Pending'),
      ('APT-002', '10:00 AM', 'Dr. Meredith Grey', 'John Smith', 'Post-Op Followup', 'Pending'),
      ('APT-003', '10:00 AM', 'Dr. Bhuvana', 'Krithika', 'Throat infection', 'Pending')
    `);
    console.log("Inserted sample data");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
})();
