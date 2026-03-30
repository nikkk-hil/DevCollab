class ApiError extends Error {
    constructor(
        statusCode, 
        message,
        stack=""
    ){
        super(message);
        this.statusCode = statusCode;
        this.message = message
        this.sucess = false;
        
        if (stack)
            this.stack = stack
        else
            Error.captureStackTrace(this, this.constructor)
    }
}

export {ApiError}