const { auth } = require('./../../firebase-config');
const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');


const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};



module.exports = {
    registerUser,
  };