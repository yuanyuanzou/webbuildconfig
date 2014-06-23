var express = require('express');
var path = require('path');
var router = express.Router();

var User = require('../modules/user');
var account = require('../public/javascripts/my');
var settings = require('../settings');
var fileOper = require('../public/javascripts/file_utils');

/* GET login page. */
router.get('/', function(req, res) {
    var userName = account.getUser(req);
    if (userName == null || userName == undefined || userName == '') {
        res.render('login');
    } else {
        res.redirect('/');
    }
});

router.post('/', function(req, res) {
    var user = new User(req.body.user);
    var pwd = user.password;

    if (user.name == null || user.name == '') {
        res.render('login', {
            error: "用户名不能为空!"
        });
        /*return res.redirect('/login');*/
    } else if (pwd == null || pwd == '') {
        res.render('login', {
            error: "密码不能为空!"
        });
        /*return res.redirect('/login');*/
    }

    User.find({
        name: user.name,
        password: user.password
    }, function(err, docs) {
        if (!err) {
            if (docs != '') {
                console.log(docs);
                console.log("Login successed!.");
                account.setUser(user.name, res);
                fileOper.createUsrDir(settings.dataDir, user.name);
                return res.redirect('/');
            } else {
                res.render('login', {
                    error: "用户名或密码不正确!"
                });
            }
        } else {
            res.render('login', {
                error: "用户名或密码不正确!"
            });
        }
    });
});

module.exports = router;