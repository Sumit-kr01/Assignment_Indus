const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book',
  },
  issueDate: { type: Date, default: Date.now() },
  returnDate: { type: Date, default: Date.now() + 14 * 24 * 60 * 60 * 1000 },
  price: { type: Number, required: true },

  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },

  userName: String,

  active: { type: Boolean, default: true },
});

issueSchema.index({ userId: 1 });
issueSchema.index({ bookId: 1 });
module.exports = mongoose.model('Issue', issueSchema);
