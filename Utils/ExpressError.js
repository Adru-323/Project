//customm Errors  
//sending status code


class ExpressError extends Error {
    constructor(statusCode, message) {
        super(); 
        this.statusCode = statusCode;                              //p1.statusCode =404,
        this.message=message;
    }
}

module.exports = ExpressError;


