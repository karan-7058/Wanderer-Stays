// wrapasync function is used to handle all the async errors without using try ....catch.
module.exports=function WrapAsync(fn) {
    return function(req, res, next){
        fn(req, res, next).catch(next);
    }
}