var args=process.argv;
console.log(args);
/*
[ '/usr/bin/node',  
  '/workspace/web2_backend/nodejs/conditional.js',
  'raycho' ]
*/

console.log('A');
console.log('B');
if(args[2] === '1'){
  console.log('C1');
} else {
  console.log('C2');
}
console.log('D');