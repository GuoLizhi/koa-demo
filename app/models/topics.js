const { model, Schema } = require('./index')

const topicSchema = new Schema({
  __v: {
    type: Number,
    select: false
  },
  name: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String
  },
  introduction: {
    type: String,
    select: false
  }
})

module.exports = model('Topic', topicSchema)
