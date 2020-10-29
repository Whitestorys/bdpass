function atou(str) {
    return decodeURIComponent(escape(window.atob(str)));
}
function Trim(str){
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
function addbdstoken(){
    var x=document.getElementById("save")
    x.action="https://pan.baidu.com/api/rapidupload?app_id=250528&bdstoken="+ document.getElementById("bdstoken").value +"&channel=chunlei&clienttype=0&rtype=1&web=1"
}
function copy(){
    const input = document.querySelector('#copy_script');
    input.select();
    if (document.execCommand('copy')) {
        document.execCommand('copy');
        alert('复制成功');
    }
}
function getLink(link) {
    if(document.getElementById('bdstoken').value == ""){
        alert('未输入bdstoken');
        return;
    }
    var bdpan = link.match(/bdpan:\/\/(.+)/);
    var pcs = link.match('BaiduPCS-Go');
    var mengji = link.match(/.{32}#.{32}/);
    var bdlink = link.match('bdlink(.+)');
    var pan = link.match(/^pan:\/\//);
    if (bdpan){
        var de_b64 = atou(bdpan[1]);
        var md5 = de_b64.match(/\|(.{32})\|/)[1];
        var slicemd5 = de_b64.match(/\|([^\|]{32})$/)[1];
        var file_length = de_b64.match(/\|([0-9]+)\|/)[1];
        var file_name = de_b64.match(/^(.+\.[a-zA-Z]{1,9})\|/)[1];
        saveFile(md5, slicemd5, file_length, file_name, bdpan);
    }
    else if (pcs){
        var input = link;
        var length = input.match(/length\=([0-9]+)/)[1];
        var md5 = input.match(/\-md5\=(.{32})/)[1];
        var slicemd5 = input.match(/\-slicemd5\=(.{32})/)[1];
        var file_name = input.match(/\"(.+)\"/)[1];
        saveFile(md5, slicemd5, length, file_name, pcs);

    }
    else if (mengji){
        var input = link;
        var md5 = input.match(/^(.{32})#/)[1];
        var slicemd5 = input.match(/#(.{32})#/)[1];
        var file_length = input.match(/#([0-9]+)#/)[1];
        var file_name = input.match(/#[0-9]+#(.+)$/)[1];
        file_name = Trim(file_name);
        saveFile(md5, slicemd5, file_length, file_name, mengji);
    }
    else if (bdlink){
        var bdlink1 = link.match('bdlink\=([a-zA-Z0-9\=\/\+]+\={0,2})[\#\?\&]?');
        var bdlink2 = link.match('bdlink\=([a-zA-Z0-9\=\/\+]+\={0,2})$');
        var de_b64;
        if(bdlink1){
            de_b64 = atou(bdlink1[1]);
            if(de_b64.split('\n').length == 1)
                getLink(de_b64);
            else
                alert('含多个链接，请使用批量转存');
        }
        else if(bdlink2){
            var de_b64 = atou(bdlink2[1]);
            if(de_b64.split('\n').length == 1)
                getLink(de_b64);
            else
                alert('含多个链接，请使用批量转存');
        }
    }
    else if (pan){
        const lib = JsonUrl('lzw');
        lib.decompress(link.match(/^pan:\/\/(.+)/)[1]).then(output => {
            if(output.length>1){alert('含多个链接，请使用批量转存');}
            else
                saveFile(output[0]['content-md5'],output[0]['slice-md5'],output[0]['content-length'],output[0]['path'],'pan');})
    }
    else
        alert('未检测到有效秒传链接')
}
function saveFile(md5,slicemd5,length,name,method){
    var saveForm = document.createElement("form");
    document.body.appendChild(saveForm);
    saveForm.method = 'POST';
    saveForm.target = '_blank';
    saveForm.action = "https://pan.baidu.com/api/rapidupload?app_id=250528&bdstoken="+ document.getElementById("bdstoken").value +"&channel=chunlei&clienttype=0&rtype=1&web=1";
    var path = document.createElement("input");
    path.setAttribute("type", "hidden");
    path.setAttribute("name", "path");
    saveForm.appendChild(path);
    if (method == 'pcs'){
        path.setAttribute("value",  name)
    }
    else
    {
        path.setAttribute("value",'/' + name)
    }
    var md5_input = document.createElement("input");
    md5_input.setAttribute("type", "hidden");
    md5_input.setAttribute("name", "content-md5");
    saveForm.appendChild(md5_input);
    md5_input.setAttribute("value", md5);
    var slice_md5 = document.createElement("input");
    slice_md5.setAttribute("type", "hidden");
    slice_md5.setAttribute("name", "slice-md5");
    saveForm.appendChild(slice_md5);
    slice_md5.setAttribute("value", slicemd5);
    var file_length = document.createElement("input");
    file_length.setAttribute("type", "hidden");
    file_length.setAttribute("name", "content-length");
    saveForm.appendChild(file_length);
    file_length.setAttribute("value", length);
    saveForm.submit();
}