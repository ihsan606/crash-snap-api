const crypto = require('crypto');
const { predictImageSegmentation } = require('../predict/predict.model');
const { storeData, getDataByUserID } = require('./predict.service');

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

        console.log(userID)

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

module.exports = { postPredict, getPredictionHistories };
