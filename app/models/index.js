const mongoose = require('mongoose')
mongoose.connect(process.env.DB_CONN, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
mongoose.connection.once('open', () => {
  console.log('database connected!')
})
module.exports = mongoose
