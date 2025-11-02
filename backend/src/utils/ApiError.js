class ApiError extends Error{
    constructor(statuscode, message= 'something went wrong', errors = [], stack=''){
        super(message)
        this.statuscode =statuscode, 
        this.message=message, 
        this.errors = errors, 
        this.data=null, 
        this.success = false

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrance(this, this.constructor)
        }
    }

}

export default ApiError