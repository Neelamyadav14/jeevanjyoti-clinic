const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Book appointment (patient)
router.post('/book', auth, async (req, res) => {
  try {
    const { appointment_date, appointment_time, symptoms } = req.body;
    const patient_id = req.user.id;

    // Get doctor id (first doctor in system)
    const doctor = await pool.query("SELECT id FROM users WHERE role = 'doctor' LIMIT 1");
    const doctor_id = doctor.rows[0]?.id;

    const result = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, symptoms)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [patient_id, doctor_id, appointment_date, appointment_time, symptoms]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all appointments (doctor)
router.get('/all', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, u.name as patient_name, u.phone, u.blood_group, u.allergies
       FROM appointments a
       JOIN users u ON a.patient_id = u.id
       ORDER BY a.appointment_date DESC, a.appointment_time ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get my appointments (patient)
router.get('/my', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM appointments WHERE patient_id = $1 ORDER BY appointment_date DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment status (doctor)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const result = await pool.query(
      `UPDATE appointments SET status = $1, notes = $2 WHERE id = $3 RETURNING *`,
      [status, notes, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;