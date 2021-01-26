const { Schema, model } = require('./index')

const answerSchema = new Schema({
  __v: {
    type: Number,
    select: false
  },
  content: {
    type: String,
    required: true
  },
  answerer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questionId: {
    type: String,
    required: true
  },
  voteCount: {
    type: Number,
    required: true,
    default: 0
  }
})

module.exports = model('Answer', answerSchema)
