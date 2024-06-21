const sharp = require('sharp');
const ort = require('onnxruntime-node');
const costPrediction = require('../predict/predict.cost')
const { storeImage } = require('./predict.service');
const crypto = require('crypto');

const yolo_classes =  [
    'bonnet_dent', 'bumper_dent', 'bumper_scratch', 'car_window_damage', 'crack', 
    'door_dent', 'door_scratch', 'front_windscreen_damage', 'headlight_damage', 
    'quarter_panel_dent', 'quarter_panel_scratch', 'rear_windscreen_damage', 
    'taillight_damage', 'tire_flat', 'trunk_door_dent'
];

async function preprocessingImage(image) {
    const img = sharp(image);
    const md = await img.metadata();
    const [img_width,img_height] = [md.width, md.height];
    const pixels = await img.removeAlpha()
        .resize({width:640,height:640,fit:'fill'})
        .raw()
        .toBuffer();

    const red = [], green = [], blue = [];
    for (let index=0; index<pixels.length; index+=3) {
        red.push(pixels[index]/255.0);
        green.push(pixels[index+1]/255.0);
        blue.push(pixels[index+2]/255.0);
    }

    const input = [...red, ...green, ...blue];
    return [input, img_width, img_height];
} 

async function run_model(model, input) {
    try {
        input = new ort.Tensor(Float32Array.from(input), [1, 3, 640, 640]);
        const outputs = await model.run({ images: input });

        const output = outputs.output0.data;
        const mask = outputs.output1;
        return {output, mask}
    } catch (error) {
        console.error('Error running model inference:', error);
        throw error;
    }
}

function process_output(output, img_width, img_height) {
    let boxes = [];
    for (let index = 0; index < 8400; index++) {
        const [class_id, prob] = [...Array(15).keys()]
            .map(col => [col, output[8400 * (col + 4) + index]])
            .reduce((accum, item) => item[1] > accum[1] ? item : accum, [0, 0]);

        if (prob < 0.1) {
            continue;
        }
        const label = yolo_classes[class_id];
        const xc = output[index];
        const yc = output[8400 + index];
        const w = output[2 * 8400 + index];
        const h = output[3 * 8400 + index];
        const x1 = (xc - w / 2) / 640 * img_width;
        const y1 = (yc - h / 2) / 640 * img_height;
        const x2 = (xc + w / 2) / 640 * img_width;
        const y2 = (yc + h / 2) / 640 * img_height;
        boxes.push([x1, y1, x2, y2, label, prob]);
    }

    boxes = boxes.sort((box1, box2) => box2[5] - box1[5]);
    const result = [];
    const countClasses = new Array(15).fill(0);
    while (boxes.length > 0) {
        result.push(boxes[0]);
        const classIndex = yolo_classes.indexOf(boxes[0][4]);
        countClasses[classIndex]++;
        boxes = boxes.filter(box => iou(boxes[0], box) < 0.7);
    }
    return {result, countClasses};
}

function iou(box1, box2) {
    return intersection(box1, box2) / union(box1, box2);
}

function union(box1, box2) {
    const [box1_x1, box1_y1, box1_x2, box1_y2] = box1;
    const [box2_x1, box2_y1, box2_x2, box2_y2] = box2;
    const box1_area = (box1_x2 - box1_x1) * (box1_y2 - box1_y1);
    const box2_area = (box2_x2 - box2_x1) * (box2_y2 - box2_y1);
    return box1_area + box2_area - intersection(box1, box2);
}

function intersection(box1, box2) {
    const [box1_x1, box1_y1, box1_x2, box1_y2] = box1;
    const [box2_x1, box2_y1, box2_x2, box2_y2] = box2;
    const x1 = Math.max(box1_x1, box2_x1);
    const y1 = Math.max(box1_y1, box2_y1);
    const x2 = Math.min(box1_x2, box2_x2);
    const y2 = Math.min(box1_y2, box2_y2);
    return (x2 - x1) * (y2 - y1);
}

async function predictImageSegmentation(model, regressionModel, images) {
    const results = [];
    const countClassesArray = [];
    
    for (const image of images) {
        try {
            const id = crypto.randomUUID();
            const [input, img_width, img_height] = await preprocessingImage(image);
            const rawOutput = await run_model(model, input);
            const {result, countClasses} = process_output(rawOutput.output, img_width, img_height);

            const formatLabel = (label) => {
                return label.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            };
            const classes = result.map(item => formatLabel(item[4]));

            const costPredictArray = await costPrediction(regressionModel, [countClasses]);
            const costPredict = costPredictArray;
            countClassesArray.push(countClasses);

            let svgElements = '';
            for (const [x1, y1, x2, y2, label, prob] of result) {
                svgElements += `
                    <rect x="${x1}" y="${y1}" width="${x2-x1}" height="${y2-y1}" 
                        style="fill:none;stroke:green;stroke-width:4" />`;
            }
            const svgImage = `
                <svg width="${img_width}" height="${img_height}">
                    ${svgElements}
                </svg>
            `;

            let img = sharp(image);

            img = img.composite([{
                input: Buffer.from(svgImage),
                blend: 'over'
            }]);

            const bufferWithBoundingBoxes = await img.jpeg().toBuffer();
            const filename = `processed_images/${id}.jpg`;
            console.log("filename", filename)
            const imageAfterProcess = await storeImage(bufferWithBoundingBoxes, filename); 
            const imageUrl = imageAfterProcess;

            results.push({ damageDetected:classes, costPredict, imageUrl });
            } catch (error) {
                console.error('Error processing image:', error);
                results.push({ result: null, finalCost: null, error: error.message });
                countClassesArray.push(null);
                throw error;
                }
    }   
    return { results, countClassesArray};
}

module.exports = {
    predictImageSegmentation,
};
