var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require('path');

var formidable = require('formidable');
var fileOper = require('../public/javascripts/file_utils');
var account = require('../public/javascripts/my');
var build = require('../public/javascripts/build.js');
var settings = require('../settings');

router.get('/', function(req, res) {
    if (account.getUser(req)) {
        console.log("Hello " + account.getUser(req) + "!");
        var json_data = fileOper.getProductsInfo(settings.imgPath);
        res.render('demo', json_data);
    } else {
        res.redirect('/login')
    }
});


router.post('/', function(req, res) {
    console.log("Request handler 'upload' was called.");
    var formidable = require('formidable');
    var form = new formidable.IncomingForm();

    var file = {},
        post = {};
    var file_arr = new Array();
    var userName = account.getUser(req);
    var uploadApkPath = path.join(settings.dataDir, userName, 'upload'); //文件上传 临时文件存放路径 
    form.uploadDir = uploadApkPath;

    form.parse(req, function(error, fields, files) {
        for (var key in files) {
            if (files[key].name.length == 0) {
                fs.unlinkSync(files[key].path);
            } else {
                fs.renameSync(files[key].path, path.join(form.uploadDir, files[key].name));
            }
        }
    });

    form.on('error', function(err) {
        console.log(err); //各种错误
    })
        .on('field', function(field, value) {
            post[field] = value;
        })
        .on('file', function(field, file) { //上传文件
            file[field] = file;
            file_arr.push(file['name'])
        })
        .on('end', function() {
            console.log('end'); //解析完毕 做其他work
            var build_status = build.build_status(false);
            var sourImg = post['image_path'];
            console.log("Source Img : " + sourImg);
            var deletApklist = post['del_apk'].split(',');
            console.log("Delet apk : " + deletApklist);
            var tarImg = path.join(settings.dataDir, userName, 'imgs', path.basename(sourImg));
            var uploadapk_array = new Array();
            for (var i in file_arr){
                var tmp ={}
                tmp.name = file_arr[i];
                tmp.key = post[file_arr[i]];
                uploadapk_array.push(tmp);
            }
            console.log(uploadapk_array);
            var addApkList = fileOper.joinApkAndKey(uploadApkPath,uploadapk_array);
            console.log(addApkList);
            build.to_build(settings.custFile, addApkList, deletApklist, sourImg, tarImg, function() {
                console.log(build.build_result());
                res.render('buildinfo', build.build_result());
            });
        });
});


module.exports = router;