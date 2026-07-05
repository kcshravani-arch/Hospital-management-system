const db = require('./db');

(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id VARCHAR(20) PRIMARY KEY,
        time VARCHAR(20) NOT NULL,
        doctor VARCHAR(100) NOT NULL,
        patient VARCHAR(100) NOT NULL,
        reason VARCHAR(255) NOT NULL
      )
    `);
    console.log("Table 'appointments' created successfully.");
    
    const [rows] = await db.query('SELECT * FROM appointments');
    if (rows.length === 0) {
      await db.query(`
        INSERT INTO appointments (id, time, doctor, patient, reason) VALUES
        ('APT-001', '09:15 AM', 'Dr. Gregory House', 'Alice Brown', 'Cardiac Checkup'),
        ('APT-002', '10:00 AM', 'Dr. Meredith Grey', 'John Smith', 'Post-Op Followup'),
        ('APT-003', '10:00 AM', 'Dr. Bhuvana', 'Krithika', 'Throat infection')
      `);
      console.log("Initial data inserted into 'appointments'.");
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit();
  }
})();
