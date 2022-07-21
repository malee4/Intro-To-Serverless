// ProcessImageUpload/index.js
const { v4: uuidv4 } = require('uuid');
const { ApiKeyCredentials } = require('@azure/ms-rest-js');
// const { ComputerVisionClient } = require('@azure/cognitiveservices-computervision');
const sleep = require('util').promisify(setTimeout);
const { FormRecognizerClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");

const STATUS_SUCCEEDED = "succeeded";
const STATUS_FAILED = "failed"

module.exports = async function (context, myBlob) {

    try {
        context.log("JavaScript blob trigger function processed blob \n Blob:", context.bindingData.blobTrigger, "\n Blob Size:", myBlob.length, "Bytes");
        
        const formRecognizer_ResourceKey = process.env.FORM_RECOGNITION_KEY;
        const formRecognizer_Endpoint = process.env.FORM_RECOGNITION_ENDPOINT;

        const client = new FormRecognizerClient(formRecognizer_Endpoint, new AzureKeyCredential(formRecognizer_ResourceKey));

        context.log(context.bindingData.uri);

        const poller = await client.beginRecognizeBusinessCardsFromUrl(context.bindingData.uri, {
            onProgress: (state) => {
                console.log(`status: ${state.status}`);
            }
        });

        const [businessCard] = await poller.pollUntilDone();

        if (businessCard === undefined) {
            throw new Error("Failed to extract data from at least one business card.");
        }

        context.log(businessCard);

        // IF TIME: reorganize info from businessCard

        // upload to CosmosDB
        


    } catch (err) {
        context.log(err);
        return;
    }

};