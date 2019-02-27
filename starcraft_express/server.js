let express = require('express')
let bodyParser = require('body-parser')

let app = express()

// set bodyparser middelware
app.use(bodyParser.json())

// routes
app.use(require('./routes'))


const PORT = 3000

app.listen(PORT, () => {
  console.log('Listening on port 3000');
})

module.exports = app