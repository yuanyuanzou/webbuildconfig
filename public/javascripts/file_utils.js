var fs = require('fs');
var path = require("path");
var process = require('child_process');
var account = require('./my');
var build = require('./build.js');
var temp;
var status = false;
var result = {
    "imgname": "",
    "imgpath": ""
};

function getProductsInfo(fPath) {
    temp = {
        "factorys": {}
    };
    listFile(fPath, 0, temp.factorys);
    console.log(temp);
    return temp;
}

function listFile(fpath, floor, parent) {
    floor++;
    //console.log(parent);
    var files = fs.readdirSync(fpath);
    var len = files.length;
    for (var i = 0, j = 0; i < len; i++) {
        var item = files[i];
        var tmpPath = fpath + '/' + item;
        var stat = fs.statSync(tmpPath);

        if (stat.isDirectory()) {
            if (floor == 1) {
                parent[item] = {};
            } else {
                parent[item] = [];
            }
            listFile(tmpPath, floor, parent[item]);
        } else {
            var extName = path.extname(tmpPath);
            if (extName == '.img') {
                var child = {
                    "name": item,
                    "path": tmpPath
                };
                parent.push(child);
            }
        }
    }
    return parent;
}

function getApkList(imgPath) {
    console.log("apk file ======= " + imgPath);
    var apkListPath = imgPath + '.apklist';
    var contents = fs.readFileSync(apkListPath, 'utf8');
    console.log('contents', contents);
    var apkList = contents.split('\n');
    console.log("total apk number is " + apkList.length);
    var apks = [];
    for (var i = 0; i < apkList.length; i++) {
        apks.push({
            "name": apkList[i]
        });
    }
    var json_data = {
        "apks": apks
    };
    console.log(json_data);
    return json_data;
}

//直接调用命令
function createDir(dirPath) {
    fs.exists(dirPath, function(exist) {
        if (exist) {
            console.log(dirPath + ' existed');
        } else {
            console.log('not existed');
            fs.mkdirSync(dirPath);
        }
    });
}

function delDir(dirPath) {
    process.exec('rm -rf ' + dirPath, function(error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
}

function imgCust1(tarPath, souPath) {
    tarPath = path.join(tarPath, 'result.img');
    console.log(tarPath + '----' + souPath);
    var command = 'zip -r ' + tarPath + ' ' + souPath;
    if (execSync(command)) {
        var imgName = path.basename(tarPath);
        result = {
            "imgname": imgName,
            "imgpath": tarPath
        };
        return result;
    }
}

function execSync(command) {
    // 在子shell中运行命令
    var last = process.exec(command);

    last.on('exit', function(code) {
        console.log('子进程已关闭，代码：' + code);
        status = true;
    });
    // 阻塞事件循环，直到命令执行完
    /*while (!fs.existsSync('done')) {
	     console.log("running...............");
    }*/
}

function get_status() {
    return status;
}

function get_build_result() {
    return result;
}

//imgcust.sh [-l LANGUAGE] [-t TIMEZONE] [-a APK]... [-d FILE]... INPUT_IMAGE'
function buildImg(custShPath, addApkList, deletApklist, inImg, outImg, callback) {
    
    var apkCmd = "";
    for (var i = 0; i < addApkList.length; i++) {
        //var obj = addApkList[i];
        apkCmd += ' -a ' + addApkList[i];
    }
    var del_cmd = "";
    for (var i in deletApklist) {
        if (deletApklist[i]) {
            del_cmd += ' -d ' + deletApklist[i];
        }
    }

    var command = custShPath + ' ' + apkCmd + ' ' + del_cmd + ' ' + inImg + ' ' + outImg;
    console.log("build command : " + command);
    var build = process.exec(command);

    build.stdout.on('data', function(data) {
        console.log('标准输出：' + data);
    });

    build.on('exit', function(code) {
        console.log('子进程已关闭，代码：' + code);
        //build.build_result(outImg);
        status = true;
        result = {
            "imgname": "",
            "imgpath": outImg
        };
        callback();
    });
}

function createUsrDir(dataDir, userName) {
    createDir(path.join(dataDir, userName)); //创建用户目录                
    createDir(path.join(dataDir, userName, 'upload')); //创建用户上传目录
    createDir(path.join(dataDir, userName, 'imgs')); //创建用户生成的img目录
}

function joinApkAndKey(apkPath,uploadapkArray){
    var result = [];
    for(var i=0;i<uploadapkArray.length; i++){
        var apkObj = uploadapkArray[i];
        var apkFile = path.join(apkPath,apkObj.name);
        result.push(apkFile+":"+apkObj.key);
    }
    console.log(result);
    return result;
}

exports.getProductsInfo = getProductsInfo;
exports.getApkList = getApkList;
exports.createDir = createDir
exports.delDir = delDir
exports.build_img = buildImg
exports.get_status = get_status
exports.get_build_result = get_build_result
exports.createUsrDir = createUsrDir
exports.joinApkAndKey = joinApkAndKey