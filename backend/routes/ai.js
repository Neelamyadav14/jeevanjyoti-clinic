const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// AI Prescription Assistant
router.post('/prescription', auth, async (req, res) => {
  try {
    const { shorthand, patient_info } = req.body;

    const prompt = `You are a medical prescription assistant. Convert this shorthand prescription into a proper formatted prescription.

Patient Info: ${JSON.stringify(patient_info)}
Shorthand: ${shorthand}

Generate a professional prescription with:
1. Medicine name (full name)
2. Dosage
3. Frequency (morning/afternoon/night)
4. Duration
5. Special instructions
6. Warnings if any

Format it clearly and professionally.`;

    const result = await model.generateContent(prompt);
    res.json({ prescription: result.response.text() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'AI error' });
  }
});

// Patient History Summarizer
router.post('/summarize', auth, async (req, res) => {
  try {
    const { patient_data } = req.body;

    const prompt = `You are a medical assistant. Summarize this patient's medical history in a concise, clear format for the doctor to quickly review before a consultation.

Patient Data: ${JSON.stringify(patient_data)}

Provide:
1. Quick overview (2-3 sentences)
2. Key medical history
3. Current medications
4. Known allergies
5. Last visit summary
6. Points to focus on in today's consultation

Keep it brief and medically relevant.`;

    const result = await model.generateContent(prompt);
    res.json({ summary: result.response.text() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'AI error' });
  }
});

// Symptom Pre-Screening
router.post('/symptoms', async (req, res) => {
  try {
    const { symptoms, age, gender } = req.body;

    const prompt = `You are a medical pre-screening assistant. A patient has described their symptoms. Create a structured summary for the doctor.

Patient: ${age} year old ${gender}
Symptoms described: ${symptoms}

Generate:
1. Chief Complaint (structured)
2. Associated symptoms
3. Urgency level (routine/urgent/emergency)
4. Suggested areas of focus for the doctor
5. Questions doctor should ask

Keep it professional and concise. Do NOT diagnose.`;

    const result = await model.generateContent(prompt);
    res.json({ screening: result.response.text() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'AI error' });
  }
});

// Drug Interaction Checker
router.post('/drug-check', auth, async (req, res) => {
  try {
    const { medicines, allergies, current_medications } = req.body;

    const prompt = `You are a pharmacology assistant. Check for drug interactions and allergy conflicts.

New medicines to prescribe: ${medicines}
Patient allergies: ${allergies}
Current medications: ${current_medications}

Check for:
1. Drug-drug interactions
2. Allergy conflicts
3. Contraindications
4. Safety rating (safe/caution/danger)

Be specific and medically accurate.`;

    const result = await model.generateContent(prompt);
    res.json({ check: result.response.text() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'AI error' });
  }
});

module.exports = router;