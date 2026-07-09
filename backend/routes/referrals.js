const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Add referral
router.post('/add', auth, async (req, res) => {
  try {
    const { patient_id, referred_to, specialization, reason, notes } = req.body;

    const result = await pool.query(
      `INSERT INTO referrals (patient_id, referred_to, specialization, reason, notes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [patient_id, referred_to, specialization, reason, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all referrals
router.get('/all', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.name as patient_name, u.phone
       FROM referrals r
       JOIN users u ON r.patient_id = u.id
       ORDER BY r.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update referral status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const result = await pool.query(
      `UPDATE referrals SET status = $1 WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get referral analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const bySpecialization = await pool.query(
      `SELECT specialization, COUNT(*) as count
       FROM referrals GROUP BY specialization ORDER BY count DESC`
    );

    const byStatus = await pool.query(
      `SELECT status, COUNT(*) as count
       FROM referrals GROUP BY status`
    );

    const recentReferrals = await pool.query(
      `SELECT r.*, u.name as patient_name
       FROM referrals r
       JOIN users u ON r.patient_id = u.id
       ORDER BY r.created_at DESC LIMIT 5`
    );

    res.json({
      by_specialization: bySpecialization.rows,
      by_status: byStatus.rows,
      recent: recentReferrals.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;