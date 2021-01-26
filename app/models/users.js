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
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
    select: false
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    select: false
  },
  employments: {
    type: [{
      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
      },
      job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
      }
    }],
    select: false
  },
  educations: {
    type: [{
      school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
      },
      major: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
      },
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
  },
  followingTopics: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic'
    }],
    select: false
  },
  likingAnswers: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer'
    }],
    select: false
  },
  dislikingAnswers: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer'
    }],
    select: false
  }
})
const User = mongoose.model('User', userSchema)

module.exports = User
