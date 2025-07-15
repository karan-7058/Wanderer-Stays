// this is the expresserror class which extends error super class and use to handle express internal server
class ExpressError extends Error{
    constructor(status, message){
      super();
      this.status=status;
      this.message=message;

    }

}

module.exports=ExpressError;