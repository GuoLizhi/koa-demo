const mongoose = require('./index')

const userSchema = mongoose.Schema({
  __v: {
    type: Number,
    select: false
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  }
})
const User = mongoose.model('User', userSchema)

module.exports = User
