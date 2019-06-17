var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/index');
});
router.get('/times', (req, res) => res.send(showTimes()));


showTimes = () => {
  let result = ''
  const times = process.env.TIMES || 5
  for (i = 0; i < times; i++){
    result += i + ' '
  }
  return result;
}

module.exports = router;
