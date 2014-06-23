var express = require('express');
var router = express.Router();

var User = require('../modules/user');
var account = require('../public/javascripts/my');
var settings = require('../settings');
var fileOper = require('../public/javascripts/file_utils');

router.get('/', function(req, res) {
    res.render('registy', {
        title: "user regist!"
    });
});

router.post('/', function(req, res) {
    var user = new User(req.body.user);

    User.find({
        name: user.name
    }, function(err, docs) {
        if (!err) {
            if (docs != '') {
                console.log("该用户已存在!");
                res.render('registy', {
                    error: "该用户已存在!"
                });
            } else {
                user.save(function(err, user) {
                    if (!err) {
                        console.log(user);
                        account.setUser(user.name, res)
                        fileOper.createUsrDir(settings.dataDir, user.name);
                        res.redirect('/login');
                    }
                });
            }
        } else {
            res.render('registy', {
                error: "用户名或密码不正确!"
            });
        }
    });
});

module.exports = router;