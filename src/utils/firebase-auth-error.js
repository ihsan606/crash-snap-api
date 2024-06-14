// FirebaseAuthError.js

class FirebaseAuthError extends Error {
    constructor(message) {
      super(message);
      this.name = this.constructor.name;
      this.message = message;
      this.statusCode = this.getStatusCode();
    }
  
    getStatusCode() {
      if(this.message.includes("auth/invalid-credential")) {
        this.message = "invalid-credential"
        return 401;
      }
    }
  
    toJSON() {
      return {
        error: true,
        message: this.message,
        code: this.code,
      };
    }
  }
  
  module.exports = FirebaseAuthError;
  