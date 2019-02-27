let express = require('express')
let router = express.Router()

router.get('/', (req, res, next) => {
  res.json({
    status: '好'
  })
})

module.exports = router