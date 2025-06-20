require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors'); // 1️⃣ Import cors

const app = express();

app.use(cors({ origin: 'https://diamond-club.mybigcommerce.com' })); // 2️⃣ Add this before routes
app.use(express.json());

const PORT = process.env.PORT || 3000;
const STORE_HASH = process.env.BC_STORE_HASH;
const TOKEN = process.env.BC_API_TOKEN;
const API_BASE = `https://api.bigcommerce.com/stores/${STORE_HASH}/v3`;

const headers = {
  'X-Auth-Token': TOKEN,
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

// Get subcategories
app.get('/api/subcategories/:parentId', async (req, res) => {
  const url = `${API_BASE}/catalog/categories?parent_id=${req.params.parentId}`;
  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get products
app.get('/api/products/:categoryId', async (req, res) => {
  const url = `${API_BASE}/catalog/products?categories:in=${req.params.categoryId}&limit=20`;
  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy running at http://localhost:${PORT}`);
});
