const { Firestore } = require('@google-cloud/firestore');
const { storage, ref, uploadBytes, getDownloadURL } = require('../../firebase-config'); // Adjust the path as necessary

const storeData = async (id, data) => {
    const db = new Firestore();

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
module.exports = { storeData, storeImage }; 
