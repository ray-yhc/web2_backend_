var fs = require('fs');


// console.log('A');
// var result= fs.readFileSync('sample.txt','utf-8'); //동기. 순서대로 진행
// console.log(result);
// console.log('C');

console.log('A');
fs.readFile('sample.txt','utf-8', function(err, result){ //'B를 읽기 전에 작업속도가 빠른 'C'를 먼저 출력
    console.log(result);
});

console.log('C');