const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');

const bookSchema = new mongoose.Schema({
  title: String,
  copies: { type: Number },
  author: { fName: String, lName: String },
  // description: { type: String, es_indexed: true },
  price: Number,
  genre: String,
  minAgeCategory: Number,
  isDiscarded: { type: Boolean, default: false },

});

bookSchema.index({ title: 1 });
bookSchema.index({ 'author.fName': 1, 'author.lName': 1 });
bookSchema.index({ genre: 1 });
// bookSchema.plugin(mongoosastic);
// const stream = bookSchema.synchronize();
// let count = 0;
// stream.on('data', (err, doc) => {
//   count++;
// });
// stream.on('close', () => {
//   console.log(`indexed ${count} documents`);
// });
// stream.on('error', (err) => {
//   console.log(err);
// });

module.exports = mongoose.model('Book', bookSchema);
