var http = require('http');
var fs = require('fs');
var url= require('url'); //http, fs, url 모듈 사용 선언

function templeteHTML(title,fileList,body ){
    return `
                    <!doctype html>
                    <html>
                    <head>
                      <title>WEB1 - ${title}</title>
                      <meta charset="utf-8">
                    </head>
                    <body>
                      <h1><a href="/">WEB</a></h1>
                      ${fileList}
                      ${body}
                    </body>
                    </html>
                `;
};
//data 폴더 리스트 만들기
function templeteList(files){
    var fileList='<ul>'
    for(let i=0; i<files.length;i++){
        fileList+=`<li><a href="/?id=${files[i]}">${files[i]}</a></li>`;
    }
    fileList += '</ul>'
    return fileList
};

var app = http.createServer(function(request, response) {
    var _url = request.url;
    console.log(_url)
    
    var queryData = url.parse(_url, true).query;
    var pathName =  url.parse(_url, true).pathname
    console.log(pathName)
    
    if (pathName==='/'){
        if(queryData.id===undefined){
            //if (err) throw err;
            fs.readdir("data", (err,files) =>{
                var title='Welcome'
                var discription="hello node.js" 
                var fileList=templeteList(files)
                var templete=templeteHTML(title,fileList, `<h2>${title}</h2></p>${discription}</p>`);
                response.writeHead(200);
                response.end(templete);
            });
        } else{
            fs.readdir("data", (err,files) =>{
                
                var fileList='<ul>' //data 폴더 리스트 만들기
                for(let i=0; i<files.length;i++){
                    fileList+=`<li><a href="/?id=${files[i]}">${files[i]}</a></li>`;
                }
                fileList += '</ul>'
                console.log(fileList)
            
            
                fs.readFile(`data/${queryData.id}`,'utf-8', (err, discription) => {
                    //if (err) throw err;
                    var title=queryData.id
                    var templete=templeteHTML(title,fileList, `<h2>${title}</h2></p>${discription}</p>`);
                    response.writeHead(200);
                    response.end(templete);
                });
            });
        }
                        
        
    } else{
        response.writeHead(404);
        response.end('Not found');
    }
    
});
app.listen(3000);

