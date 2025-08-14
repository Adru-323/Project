//Error handling wrapping try and catch 

// function wrapAsync(fn){            //this function is used as the alternat of try and error
//     return function (req,res,nexr){
//         fn(req,res,next).catch(next)  //next calls the error handler
//     }
// }

//same function is used down 

module.exports = (fn) => {
    return (req,res,next) =>  {
        fn(req,res,next).catch(next);
    }
}