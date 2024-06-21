const { Firestore } = require('@google-cloud/firestore');
const { storage, ref, uploadBytes, getDownloadURL } = require('../../firebase-config'); 

const db = new Firestore();

const storeData = async (id, data) => {

  const predictCollection = db.collection('predictions');
  return predictCollection.doc(id).set(data);
}

const storeImage = async (buffer, filename) => {
  try {
    const storageRef = ref(storage, filename);
    const metadata = {
      contentType: 'image/jpg'
    };
    await uploadBytes(storageRef, buffer, metadata);
    const imageUrl = await getDownloadURL(storageRef);
    return imageUrl;
  } catch (error) {
    console.error('Error uploading image to Firebase Storage:', error);
    throw error;
  }
}

const getDataByUserID = async (uid) => {
  try {
    const predictionsRef = db.collection('predictions');
    const querySnapshot = await predictionsRef.where('userID', '==', uid).orderBy('createdAt', 'desc').get();;

    if (querySnapshot.empty) {
      console.log('No matching documents.');
      return [];
    }

    let predictions = [];
    querySnapshot.forEach(doc => {
      predictions.push({ id: doc.id, ...doc.data() });
    });

    return predictions;
  } catch (error) {
    console.error('Error getting predictions:', error);
    throw new Error('Failed to get predictions');
  }
}


const getDataByID = async (id) => {
  try {

      const docRef = db.collection('predictions').doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
          console.log('No document found with the given ID.');
          return null;
      }

      return { id: doc.id, ...doc.data() };
  } catch (error) {
      console.error('Error getting document:', error);
      throw new Error('Failed to get document');
  }
}


const deleteDataByID = async (id) => {
  try {
    const docRef = db.collection('predictions').doc(id);
    await docRef.delete();
    console.log(`Document with ID ${id} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw new Error('Failed to delete document');
  }
}



module.exports = { storeData, storeImage, getDataByUserID, getDataByID, deleteDataByID }; 
