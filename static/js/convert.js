function atou(str) {
    return decodeURIComponent(escape(window.atob(str)));
}
function utoa(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}
function Trim(str){
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
function getLink(link,backcall) {
    var bdpan = link.match(/bdpan:\/\/(.+)/);;
    var pcs = link.match('BaiduPCS-Go');
    var mengji = link.match(/.{32}#.{32}/);
    if (bdpan != null){
        var de_b64 = atou(bdpan[1]);
        var md5 = de_b64.match(/\|(.{32})\|/)[1];
        var slicemd5 = de_b64.match(/\|([^\|]{32})$/)[1];
        var file_length = de_b64.match(/\|([0-9]+)\|/)[1];
        var file_name = de_b64.match(/^(.+?)\|/)[1];
        backcall(md5, slicemd5, file_length, file_name);
    }
    else if (pcs){
        var input = link;
        var length = input.match(/length\=([0-9]+)/)[1];
        var md5 = input.match(/\-md5\=(.{32})/)[1];
        var slicemd5 = input.match(/\-slicemd5\=(.{32})/)[1];
        var file_name = input.match(/\"(.+)\"/)[1];
        backcall(md5, slicemd5, length, file_name);

    }
    else if (mengji){
        var input = link;
        var md5 = input.match(/^(.{32})#/)[1];
        var slicemd5 = input.match(/#(.{32})#/)[1];
        var file_length = input.match(/#([0-9]+)#/)[1];
        var file_name = input.match(/#[0-9]+#(.+)$/)[1];
        file_name = Trim(file_name);
        backcall(md5, slicemd5, file_length, file_name);
    }
}
function convertpcs(md5, slicemd5, file_length, file_name){
    return 'BaiduPCS-Go rapidupload -length=' + file_length + ' -md5=' + md5 + ' -slicemd5=' + slicemd5 + ' \"\/' + file_name + '\"';
}function convertpcs(md5, slicemd5, file_length, file_name){
    return 'BaiduPCS-Go rapidupload -length=' + file_length + ' -md5=' + md5 + ' -slicemd5=' + slicemd5 + ' \"\/' + file_name + '\"';
}
function convert(){
    document.getElementById('convert').innerHTML = '';
    var lines = document.getElementById('link').value.split('\n');
    for(var i = 0;i < lines.length;i++){
        //code here using lines[i] which will give you each line
        if (document.getElementById('pcs').className == 'btn btn-outline-primary active'){
            getLink(lines[i],backcall = function(md5, slicemd5, file_length, file_name){
                document.getElementById('convert').innerHTML += 'BaiduPCS-Go rapidupload -length=' + file_length + ' -md5=' + md5 + ' -slicemd5=' + slicemd5 + ' \"\/' + file_name + '\"' + '\n';
            });
        }
        if (document.getElementById('bdpan').className == 'btn btn-outline-primary active'){
            getLink(lines[i],backcall = function(md5, slicemd5, file_length, file_name){

                document.getElementById('convert').innerHTML += 'bdpan://' + utoa(file_name + '\|' + file_length + '\|' + md5 + '\|' + slicemd5) + '\n';
            });
        }
        if (document.getElementById('mengji').className == 'btn btn-outline-primary active'){
            getLink(lines[i],backcall = function(md5, slicemd5, file_length, file_name){
                document.getElementById('convert').innerHTML += md5 + '#'+slicemd5+'#'+file_length+'#'+file_name+ '\n';
            });
        }
    }
}