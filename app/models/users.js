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
  },
  avatarUrl: {
    type: String
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    default: 'male',
    required: true
  },
  headline: {
    type: String
  },
  locations: {
    type: [{ type: String }],
    select: false
  },
  business: {
    type: String,
    select: false
  },
  employments: {
    type: [{
      company: { type: String },
      job: { type: String }
    }],
    select: false
  },
  educations: {
    type: [{
      school: { type: String },
      major: { type: String },
      diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
      entranceYear: { type: Number },
      graduationYear: { type: Number }
    }],
    select: false
  },
  following: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    select: false
  }
})
const User = mongoose.model('User', userSchema)

module.exports = User
