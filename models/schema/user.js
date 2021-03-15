const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  userName: {
    type: String,
  },
  password: {
    type: String,
  },

  email: {
    type: String,
  },
  isAdmin: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  dob: { type: Date },

});

userSchema.index({ userName: 1 });

module.exports = mongoose.model('User', userSchema);
