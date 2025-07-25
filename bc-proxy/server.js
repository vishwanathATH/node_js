
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors({ origin: 'https://diamond-club.mybigcommerce.com' })); 
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

// ===== endpoint for sub category====================.
app.get('/api/subcategories/:parentId', async (req, res) => {
  const url = `${API_BASE}/catalog/categories?parent_id=${req.params.parentId}`;
  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetching subcategories:", err);
    res.status(500).json({ error: 'Server error fetching subcategories' });
  }
});

// -------------  endpoint for parent category  ---------------------
app.get('/api/products/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  const { include, limit } = req.query;
  let url = `${API_BASE}/catalog/products?categories:in=${categoryId}`;
  
  if (include) {
    url += `&include=${include}`; 
  }
  if (limit) {
    url += `&limit=${limit}`; 
  } else {
    url += `&limit=250`; 
  }

  console.log(`✅ Proxying request to BigCommerce: ${url}`);

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`BigCommerce API error: ${response.status} ${errorBody}`);
    }
    const data = await response.json();

    // -------------------------complete object with custom fields-------------------.
    res.json(data);

  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: 'Server error fetching products' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Diamond Search API Proxy running at http://localhost:${PORT}`);
  console.log(`Ensure your .env file is configured with BC_STORE_HASH and BC_API_TOKEN.`);
});