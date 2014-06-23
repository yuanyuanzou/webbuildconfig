var fileOper = require('../public/javascripts/file_utils');

exports.getdata = function(req, res) {
    console.log(req.query.path);
    console.log('jason----', fileOper.getApkList(req.query.path))
    res.json(fileOper.getApkList(req.query.path))
};