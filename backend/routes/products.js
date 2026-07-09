const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Get all products (public)
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM products ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add product (doctor only)
router.post('/add', auth, async (req, res) => {
  try {
    const { name, description, price, stock, image_url } = req.body;

    const result = await pool.query(
      `INSERT INTO products (name, description, price, stock, image_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, description, price, stock, image_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, price, stock, image_url } = req.body;

    const result = await pool.query(
      `UPDATE products SET name=$1, description=$2, price=$3, stock=$4, image_url=$5
       WHERE id=$6 RETURNING *`,
      [name, description, price, stock, image_url, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Place order
router.post('/order', async (req, res) => {
  try {
    const { customer_name, customer_phone, customer_address, product_id, quantity } = req.body;

    const product = await pool.query('SELECT * FROM products WHERE id = $1', [product_id]);
    if (product.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const total_price = product.rows[0].price * quantity;

    const result = await pool.query(
      `INSERT INTO orders (customer_name, customer_phone, customer_address, product_id, quantity, total_price)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [customer_name, customer_phone, customer_address, product_id, quantity, total_price]
    );

    await pool.query(
      `UPDATE products SET stock = stock - $1 WHERE id = $2`,
      [quantity, product_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders (doctor only)
router.get('/orders/all', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, p.name as product_name
       FROM orders o
       JOIN products p ON o.product_id = p.id
       ORDER BY o.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;