document.getElementById("file").addEventListener("change", function() {
    for(i=0;i<file.files.length;i++){
        var file_md5;
        var file_length;
        var file_name;
        var slice_md5;
        var file_amount= file.files.length;

        calculate(file.files[i],file_amount,i,		callBack=function(md5,file){

            slicemd5(file,callBack = function(slicemd5){
                document.body.appendChild(document.createElement('input')).id = 'link' + i;
                document.getElementById('link'+i).type = 'hidden';
                document.getElementById('link'+i).setAttribute('value', slicemd5);
                var file_count = 1;
                file_md5 = md5;
                file_length = file.size;
                file_name = file.name;
                slice_md5 = document.getElementById('link'+i).value;
                link = file_md5 + '#' + slice_md5 + '#' + file_length + '#' + file_name
                document.getElementById('link').innerHTML += link + '\n';
                document.body.removeChild(document.getElementById('link'+i));

            })

        });


    }
})
function slicemd5(file,callBack){
    var fileReader = new FileReader(),
        blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice,
        chunkSize = 262144,
        // read in chunks of 256KB
        chunks = Math.ceil(1),
        currentChunk = 0,
        spark = new SparkMD5();

    fileReader.onload = function(e) {
        spark.appendBinary(e.target.result); // append binary string
        currentChunk++;

        if (currentChunk < chunks) {
            loadNext();
        }
        else {
            callBack(spark.end());
        }
    };

    function loadNext() {
        var start = currentChunk * chunkSize,
            end = start + chunkSize >= file.size ? file.size : start + chunkSize;

        fileReader.readAsBinaryString(blobSlice.call(file, start, end));
    };

    loadNext();
}
function calculate(file,file_amount,i,callBack){
    var fileReader = new FileReader(),
        blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice,
        chunkSize = 2097152,
        // read in chunks of 2MB
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5();

    fileReader.onload = function(e) {
        spark.appendBinary(e.target.result); // append binary string
        currentChunk++;

        if (currentChunk < chunks) {
            loadNext();
        }
        else {
            if(i>0){
                document.getElementById('log').innerHTML = 'calculating ' + i + ' of ' + file_amount + ' files';
            }
            else{
                document.getElementById('log').innerHTML = 'done'
            }
            callBack(spark.end(),file);


        }
    };

    function loadNext() {
        var start = currentChunk * chunkSize,
            end = start + chunkSize >= file.size ? file.size : start + chunkSize;

        fileReader.readAsBinaryString(blobSlice.call(file, start, end));
    };

    loadNext();
}