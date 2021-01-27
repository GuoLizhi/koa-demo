const { Schema, model } = require('./index')

const commentsSchema = new Schema({
  __v: {
    type: Number,
    select: false
  },
  content: {
    type: String,
    required: true
  },
  commentator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    select: false
  },
  questionId: {
    type: String,
    required: true
  },
  answerId: {
    type: String,
    required: true
  }
})

module.exports = model('Comment', commentsSchema)
