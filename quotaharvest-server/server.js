const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const QueueItem = require('./models/QueueItem');
const { getNetworkStatus } = require('./services/networkMonitor');
const { initScheduler } = require('./services/scheduler');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/quotaharvest')
  .then(() => console.log('[DB] MongoDB Connected successfully'))
  .catch((err) => console.error('[DB] Connection Error:', err));

// Routes
app.get('/api/queue', async (req, res) => {
  try {
    const items = await QueueItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/queue', async (req, res) => {
  try {
    const { url, title, category } = req.body;
    const newItem = new QueueItem({ url, title, category });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/queue/:id', async (req, res) => {
  try {
    await QueueItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/network-status', async (req, res) => {
  const status = await getNetworkStatus();
  res.json(status);
});

initScheduler();

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
});