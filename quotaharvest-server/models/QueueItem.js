const mongoose = require('mongoose');

const QueueItemSchema = new mongoose.Schema({
  url: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    default: 'Untitled Asset' 
  },
  category: { 
    type: String, 
    enum: ['Study', 'Media', 'Other'], 
    default: 'Study' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'downloaded', 'failed'], 
    default: 'pending' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('QueueItem', QueueItemSchema);