// FirebaseAuthError.js

class FirebaseAuthError extends Error {
    constructor(code, message) {
      super(message);
      this.name = this.constructor.name;
      this.code = code;
      this.message = message;
      this.statusCode = this.getStatusCode();
    }
  
    getStatusCode() {
      switch (this.code) {
        case 'auth/invalid-email':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          return 401; 
        case 'auth/user-not-found':
          return 404; 
        default:
          return 500;
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
  