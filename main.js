var http = require('http');
var fs = require('fs');
var url= require('url'); //http, fs, url 모듈 사용 선언

var app = http.createServer(function(request, response) {
    var _url = request.url;
    console.log(_url)
    
    var queryData = url.parse(_url, true).query;
    var pathName =  url.parse(_url, true).pathname
    var title=queryData.id
    console.log(pathName)
    
    if (pathName==='/'){
        fs.readFile(`data/${title}`,'utf-8', (err, discription) => {
            //if (err) throw err;
            var templete=`
                <!doctype html>
                <html>
                <head>
                  <title>WEB1 - ${title}</title>
                  <meta charset="utf-8">
                </head>
                <body>
                  <h1><a href="/">WEB</a></h1>
                  <ol>
                    <li><a href="/?id=HTML">HTML</a></li>
                    <li><a href="/?id=CSS">CSS</a></li>
                    <li><a href="/?id=JavaScript">JavaScript</a></li>
                  </ol>
                  <h2>${title}</h2>
                  </p>
                      ${discription}
                  </p>
                </body>
                </html>
            `;
            response.writeHead(200);
            response.end(templete);
        });
    } else{
        response.writeHead(404);
        response.end('Not found');
    }
    
});
app.listen(3000);

//NOT found 구현 부터!!!
//조윤호 화이팅!