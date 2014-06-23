function setUserName(name, res) {
    res.setHeader("Set-Cookie", ["img_username=" + name]);
    //res.send('cookie operation');  
    //setCookie("crimg_username", name, 24*60*60*1);//1天后失效    
}

function getUserName(req) {
    var cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function(cookie) {
        var parts = cookie.split('=');
        cookies[parts[0].trim()] = (parts[1] || '').trim();
    });
    var name = cookies['img_username'];
    //res.send(cookies['img_username']);//ninja  
    return name; //getCookie("crimg_username");
}

function setCookie(ticket, value, expires, path, domain, secure) {
    var expSecs = expires * 1000;
    var expDate = new Date();
    expDate.setTime(expDate.getTime() + expSecs);
    var expString = ((expires == "-1") ? "" : (";expires=" + expDate.toGMTString()))
    var pathString = ((path == null) ? "" : (";path=" + path))
    var domainString = ((domain == null) ? "" : (";domain=" + domain))
    var secureString = ((secure == true) ? ";secure" : "")
    document.cookie = ticket + "=" + encodeURI(value) + expString + pathString + domainString + secureString;
}

function getCookie(parameter) {
    var result = null;
    var myCookie = document.cookie + ";";
    var searchName = parameter + "=";
    var startOfCookie = myCookie.indexOf(searchName);
    var endOfCookie;
    if (startOfCookie != -1) {
        startOfCookie += searchName.length;
        endOfCookie = myCookie.indexOf(";", startOfCookie); //分隔符; 
        if (endOfCookie == -1) {
            endOfCookie = mycookie.indexOf("&", startOfCookie); //分隔符&  
        }
        result = decodeURI(myCookie.substring(startOfCookie, endOfCookie)); //unescape decodeURI 
    }
    if (result == null)
        result = "";
    return result;
}

exports.setUser = setUserName
exports.getUser = getUserName