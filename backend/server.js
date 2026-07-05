const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/patients', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT ID as id, name, dept, conditionstatus as condition_status FROM patients');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

app.post('/api/patients', async (req, res) => {
  try {
    const { id, name, dept, condition } = req.body;
    await db.query('INSERT INTO patients (ID, name, dept, conditionstatus) VALUES (?, ?, ?, ?)', [id, name, dept, condition]);
    res.status(201).json({ message: 'Patient added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add patient' });
  }
});

app.delete('/api/patients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM patients WHERE ID = ?', [id]);
    res.json({ message: 'Patient discharged' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to discharge patient' });
  }
});

app.get('/api/appointments', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, time, doctor, patient, reason, status FROM appointments');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

app.post('/api/appointments/book', async (req, res) => {
  try {
    const { id, time, doctor, patient, reason } = req.body;
    await db.query('INSERT INTO appointments (id, time, doctor, patient, reason, status) VALUES (?, ?, ?, ?, ?, ?)', [id, time, doctor, patient, reason, 'Pending']);
    res.status(201).json({ message: 'Appointment booked successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

app.put('/api/appointments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await db.query('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: `Appointment marked as ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update appointment status' });
  }
});

app.get('/api/doctors', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT ID, Name, Specialization, PhoneNumber FROM doctor');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));