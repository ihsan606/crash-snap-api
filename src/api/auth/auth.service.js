const { auth } = require('./../../firebase-config');
const { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } = require('firebase/auth');


const registerUser = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName: name });
    return user;
  } catch (error) {
    throw error;
  }
};



module.exports = {
    registerUser,
  };