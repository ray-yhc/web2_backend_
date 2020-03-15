//
// pm2 start {filename} --watch
// pm2 monitor
// pm2 stop {name}
// pm2 log

// 200 성공
// 302 리디렉션
// 404 not found

var http = require('http');
var fs = require('fs');
var url = require('url'); //http, fs, url 모듈 사용 선언
var qs = require('querystring');

function templeteHTML(title, fileList, body,control) {
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
                      ${control}
                      ${body}
                    </body>
                    </html>
                `;
}
//data 폴더 리스트 만들기
function templeteList(files) {
    var fileList = '<ul>';
    for (let i = 0; i < files.length; i++) {
        fileList += `<li><a href="/?id=${files[i]}">${files[i]}</a></li>`;
    }
    fileList += '</ul>';
    return fileList;
}

var app = http.createServer(function(request, response) {
    var _url = request.url;
    console.log(_url);

    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url, true).pathname;
    console.log(pathName);

    if (pathName === '/') {
        if (queryData.id === undefined) {
            //if (err) throw err;
            fs.readdir('data', (err, files) => {
                var title = 'Welcome';
                var description = 'hello node.js';
                var fileList = templeteList(files);
                var control='<a href="/create">create</a>'
                var templete = templeteHTML(
                    title,
                    fileList,
                    `<h2>${title}</h2></p>${description}</p>`
                    , control
                );
                response.writeHead(200);
                response.end(templete);
            });
        } else {
            fs.readdir('data', (err, files) => {
                fs.readFile(`data/${queryData.id}`, 'utf-8', (err, description) => {
                    //if (err) throw err;
                    var title = queryData.id;
                    var fileList = templeteList(files);
                    var control=`<a href="/create">create</a> 
                                <a href="/update?id=${title}">update</a> 
                                <form action='delete_process', method='post'>
                                <input type='hidden' name='id' value='${title}'>
                                <input type='submit' value='delete'>
                                </form>`
                    var templete = templeteHTML(
                        title,
                        fileList,
                        `<h2>${title}</h2></p>${description}</p>`,
                        control
                    );
                    response.writeHead(200);
                    response.end(templete);
                });
            });
        }
    } else if (pathName === '/create') {
        if (queryData.id === undefined) {
            //if (err) throw err;
            fs.readdir('data', (err, files) => {
                var title = 'WEB-create';
                var fileList = templeteList(files);
                var templete = templeteHTML(
                    title,
                    fileList,
                    `
                    <form action="/create_process" method="post">
                      <p><input type="text" name="title" placeholder='title'></p>
                      <p>
                        <textarea name="description" placeholder='description'></textarea>
                      </p>
                      <p>
                        <input type="submit">
                      </p>
                    </form>
                    `,
                    ''
                );
                response.writeHead(200);
                response.end(templete);
            });
        }
    } else if (pathName === '/update') {
        fs.readdir('data', (err, files) => {
            fs.readFile(`data/${queryData.id}`, 'utf-8', (err, description) => {
                //if (err) throw err;
                var title = queryData.id;
                var fileList = templeteList(files);
                var control=`<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
                var templete = templeteHTML(
                    title,
                    fileList,
                    `
                    <form action="/update_process" method="post">
<input type='hidden' name='id' value='${title}'>                
<p><input type="text" name="title" placeholder='title' value='${title}'></p>
                      <p>
                        <textarea name="description" placeholder='description'>${description}</textarea>
                      </p>
                      <p>
                        <input type="submit">
                      </p>
                    </form>
                    `,
                    ''
                );
                response.writeHead(200);
                response.end(templete);
            });
        });
    } else if (pathName === '/create_process') {
        var body = '';        
        // 한번에 과다한 정보를 전송받으면 무리가 있기 때문에, 이를 나누어 받음. 인풋 데이터, 아웃풋도 데이터.
        request.on('data', function(data){ 
            body+=data;
            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                request.connection.destroy();
        })
        //더이상 들어올 정보가 없을때 'end' 호출
        request.on('end', function(){
            var post = qs.parse(body); //body json 형식으로 변환
            console.log(post)
            var title=post.title;
            var description=post.description;
            fs.writeFile(`data/${title}`, description, (err)=>{
                response.writeHead(302, {Location:`https://web2-backend-rayzk.run.goorm.io/?id=${title}`});
                response.end();                     
            });
        })
    } else if (pathName === '/update_process') {
        var body='';
        request.on('data', function(data){
            body+=data;
        });
        request.on('end', function(data){
            var post=qs.parse(body);
            console.log(post);
            var id=post.id;
            var title=post.title;
            var description=post.description;
            fs.rename(`data/${id}`,`data/${title}`, (err)=>{
                fs.writeFile(`data/${title}`, description, (err)=>{
                    response.writeHead(302, {Location:`https://web2-backend-rayzk.run.goorm.io/?id=${title}`});
                    response.end();
                });
            });
        });
    } else if (pathName === '/delete_process') {
        var body='';
        request.on('data', function(data){
            body+=data;
        });
        request.on('end', function(data){
            var post=qs.parse(body);
            console.log(post);
            var id=post.id;
            fs.unlink(`data/${id}`, (err) => {
                if (err) throw err;
                console.log(`data/${id} was deleted`);
                response.writeHead(302, {Location:`https://web2-backend-rayzk.run.goorm.io/`});
                response.end();
            });
        });
    }else {
        response.writeHead(404);
        response.end('Not found');
    }
});
app.listen(3000);