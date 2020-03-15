// function a(){
//     console.log('A');
// };
// a();

var b=function (){
    console.log('A');
};


function slowfx(callback){
    callback();
};
slowfx(b);