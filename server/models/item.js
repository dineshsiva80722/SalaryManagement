import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  // Add other fields as needed
}, {
  timestamps: true
});

module.exports = mongoose.model('Item', itemSchema); 