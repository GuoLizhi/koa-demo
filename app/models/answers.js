const { Schema, model } = require('../index')

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
  }
})

module.exports = model('Answer', answerSchema)
