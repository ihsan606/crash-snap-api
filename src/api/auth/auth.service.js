const { auth } = require('./../../firebase-config');
const { createUserWithEmailAndPassword, updateProfile } = require('firebase/auth');
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore');

const db = getFirestore();


const registerUser = async (email, password, name) => {
  try {
    const userDocRef = doc(db, 'users', email);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      throw new Error('Email already exists');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName: name });

    // Save user info in Firestore
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName: name,
      createdAt: new Date().toISOString()
    });

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};




module.exports = {
    registerUser,
  };