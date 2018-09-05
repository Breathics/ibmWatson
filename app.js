const express = require('express');
const cors = require('cors');
const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
const { apikey } = require('./config/credentials');

const app = express();
const PORT = process.env.PORT || 7000;

const visualRecognition = new VisualRecognitionV3({
  url: 'https://gateway.watsonplatform.net/visual-recognition/api',
  version: '2018-03-19',
  iam_apikey: apikey,
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/classify', async (req, res) => {
    const { url } = req.body;
    const output = { success: false };

    if (url === undefined) {    
        output['error'] = "Please enter in a valid image url"
    }
    const params = { url };
    
    await visualRecognition.classify(params, function(err, data) {
        if (err) {
            const { code, message } = err;
            output['error'] = message;
            res.status(code).json(output);
        } else {
            output['success'] = true;
            output['data'] = data;
            res.status(200).json(output);
        }
    });
});

app.listen(PORT, () => {
    console.log("Jammin' out on PORT: ", PORT);
});



