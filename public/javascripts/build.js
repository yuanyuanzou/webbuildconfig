"use strict";
var fileOper = require('./file_utils');

exports.to_build = function(custFile, addApkList, deletApklist, sourImg, tarImg, callback) {
    fileOper.build_img(custFile, addApkList, deletApklist, sourImg, tarImg, callback);
};

exports.build_status = function() {
    return {
        'done': fileOper.get_status()
    };
};

exports.build_result = function() {
    var result = fileOper.get_build_result();
    var a = result.imgpath.split('webconfig')[1];
    return {
        'imgpath': a
    }
};

function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
}
exports.sleep = sleep;