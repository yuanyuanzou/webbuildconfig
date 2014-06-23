var express = require('express');
var path = require('path');
var router = express.Router();

var User = require('../modules/user');
var account = require('../public/javascripts/my');
var settings = require('../settings');
var fileOper = require('../public/javascripts/file_utils');

/* Logout */
/*router.get('/', function(req, res) {
    res.cookie('islogin', req.cookies, { maxAge: 0 });
    res.redirect('/login')
});*/

router.get('/', function(req, res) {
    console.log(account.getUser(req) + " logout!");
    var uploadPath = path.join(settings.dataDir, account.getUser(req), 'upload');
    console.log(" logout!" + uploadPath);
    fileOper.delDir(uploadPath); //创建用户上传目录
    account.setUser('', res);
    res.redirect('/login');
});


module.exports = router;