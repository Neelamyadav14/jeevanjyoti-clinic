const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Get all patients (doctor only)
router.get('/all', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, phone, gender, date_of_birth, blood_group, allergies, address, created_at
       FROM users WHERE role = 'patient' ORDER BY name ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single patient with full history (doctor only)
router.get('/:id', auth, async (req, res) => {
  try {
    const patient = await pool.query(
      `SELECT id, name, email, phone, gender, date_of_birth, blood_group, allergies, address
       FROM users WHERE id = $1`,
      [req.params.id]
    );

    const appointments = await pool.query(
      `SELECT * FROM appointments WHERE patient_id = $1 ORDER BY appointment_date DESC`,
      [req.params.id]
    );

    const records = await pool.query(
      `SELECT * FROM medical_records WHERE patient_id = $1 ORDER BY created_at DESC`,
      [req.params.id]
    );

    const referrals = await pool.query(
      `SELECT * FROM referrals WHERE patient_id = $1 ORDER BY created_at DESC`,
      [req.params.id]
    );

    res.json({
      patient: patient.rows[0],
      appointments: appointments.rows,
      medical_records: records.rows,
      referrals: referrals.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add medical record
router.post('/record', auth, async (req, res) => {
  try {
    const { patient_id, appointment_id, diagnosis, prescription, medicines, follow_up_date } = req.body;

    const result = await pool.query(
      `INSERT INTO medical_records (patient_id, appointment_id, diagnosis, prescription, medicines, follow_up_date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [patient_id, appointment_id, diagnosis, prescription, JSON.stringify(medicines), follow_up_date]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update patient profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, gender, date_of_birth, blood_group, allergies, address } = req.body;

    const result = await pool.query(
      `UPDATE users SET name=$1, phone=$2, gender=$3, date_of_birth=$4, blood_group=$5, allergies=$6, address=$7
       WHERE id=$8 RETURNING id, name, email, phone, gender, date_of_birth, blood_group, allergies, address`,
      [name, phone, gender, date_of_birth, blood_group, allergies, address, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;