class ApiError extends Error {
    constructor(
        statusCode, 
        message,
        stack=""
    ){
        super(message);     //calling Error class constructor (js ritual)
        this.statusCode = statusCode;
        this.message = message
        this.success = false;
        
        if (stack)
            this.stack = stack
        else
            Error.captureStackTrace(this, this.constructor) //Trace where error happened
    }
}

export {ApiError}