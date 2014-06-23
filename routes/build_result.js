var express = require('express');
var router = express.Router();
var build = require('../public/javascripts/build.js');

/* GET login page. */
router.get('/', function(req, res) {
    res.render('buildinfo', build.build_result());

});
module.exports = router;