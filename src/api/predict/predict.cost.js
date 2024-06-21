const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');
const scalerParams = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../models/model-regression/scaler.json'), 'utf8'));
const yScalerParams = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../models/model-regression/y_scaler.json'), 'utf8'));

function standardScaler(data, mean, std) {
    return data.map(row => row.map((x, i) => (x - mean[i]) / std[i]));
}

function minMaxScaler(data, min, max) {
    return data.map(row => row.map((x, i) => x * (max[i] - min[i]) + min[i]));
}

function formatToThousands(value) {
    const roundedValue = Math.round(value / 1000) * 1000;
    return `${roundedValue.toLocaleString('id-ID')}`;
}

async function costPrediction (model, countClasses){ 
    try{
        const inputData = standardScaler(countClasses, scalerParams.mean, scalerParams.std);
        const inputTensor = tf.tensor2d(inputData);
        const predictions = await model.predict(inputTensor).array()
        
        const outputs = minMaxScaler(predictions, yScalerParams.min, yScalerParams.max);
        const formattedOutput = outputs.map(subArray => 
            subArray.map(value => formatToThousands(value))
        );

        return formattedOutput;

    }catch{
        throw new Error('Failed to predict cost');
    }
}

module.exports = costPrediction;