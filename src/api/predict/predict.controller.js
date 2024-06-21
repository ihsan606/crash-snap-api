const crypto = require('crypto');
const { predictImageSegmentation } = require('../predict/predict.model');
const { storeData, getDataByUserID, getDataByID, deleteDataByID } = require('./predict.service');

const postPredict = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: true, message: 'No files uploaded' });
        }

        const images = req.files.map(file => file.buffer); 
        const { objectDetectionModel, regressionModel } = req.models; 

        const { results } = await predictImageSegmentation(objectDetectionModel, regressionModel, images);

        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const structuredResults = results.map(result => ({
            damageDetected: result.damageDetected,
            costPredict: result.costPredict.map(cost => ({
                minCost: cost[0],
                maxCost: cost[1],
                })),
            imageUrl: result.imageUrl
        }));

        const data = {
            id: id,
            userID: req.user.user_id,
            result: structuredResults,
            createdAt: createdAt,
        };

        await storeData(id, data);

        res.status(201).json({
            error: false,
            message: 'success',
            data,
        });
    } catch (error) {
        console.error('Error processing images:', error);
        res.status(500).json({ error: true, message: 'Failed to process images' });
    }
};

const getPredictionHistories = async(req, res) => {
    try {
        const userID = req.user.user_id; 


        const predictions = await getDataByUserID(userID);

        res.status(200).json({
            error: false,
            message: 'success',
            data: predictions,
        });
    } catch (error) {
        console.error('Error fetching prediction histories:', error);
        res.status(500).json({ error: true, message: 'Failed to fetch prediction histories' });
    }
}

const getPredictionByID = async(req, res) => {
    try {
        const userID = req.user.user_id; 

        const predictionID = req.params.id;

        const prediction = await getDataByID(predictionID);

        if (!prediction) {
            return res.status(404).json({ error: true, message: 'Prediction not found' });
        }

        if (prediction.userID !== userID) {
            return res.status(403).json({ error: true, message: 'This provided data is not belong to this account' });
        }


        res.status(200).json({
            error: false,
            message: 'success',
            data: prediction,
        });
    } catch (error) {
        console.error('Error fetching prediction histories:', error);
        res.status(500).json({ error: true, message: 'Failed to fetch prediction histories' });
    }
}



const deletePreditionByID = async(req, res) => {
    try {
        const userID = req.user.user_id; 

        const predictionID = req.params.id;

        const prediction = await getDataByID(predictionID);

        if (!prediction) {
            return res.status(404).json({ error: true, message: 'Prediction not found' });
        }

        if (prediction.userID !== userID) {
            return res.status(403).json({ error: true, message: 'This provided data is not belong to this account' });
        }

        await deleteDataByID(predictionID)

        res.status(200).json({
            error: false,
            message: 'Date deleted',
        });
    } catch (error) {
        console.error('Error fetching prediction histories:', error);
        res.status(500).json({ error: true, message: 'Failed to fetch prediction histories' });
    }
}

module.exports = { postPredict, getPredictionHistories, getPredictionByID, deletePreditionByID };
