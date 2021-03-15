const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  copies: { type: Number },
  author: { fName: String, lName: String },
  price: Number,
  genre: String,
  minAgeCategory: Number,
  isDiscarded: { type: Boolean, default: false },

});

bookSchema.index({ title: 1 });
bookSchema.index({ 'author.fName': 1, 'author.lName': 1 });
bookSchema.index({ genre: 1 });
module.exports = mongoose.model('Book', bookSchema);
