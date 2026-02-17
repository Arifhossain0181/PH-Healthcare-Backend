
class APPError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number ,stack = "") {
        super(message); // Call the parent constructor to set the message property and capture the stack trace my Error message 
        this.statusCode = statusCode;
      if(stack){
        this.stack = stack;
      }
      else {
        Error.captureStackTrace(this, this.constructor); // Capture the stack trace for this error instance
      }

    }

}
export default APPError;