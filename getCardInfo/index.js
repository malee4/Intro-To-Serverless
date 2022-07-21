// ProcessImageUpload/index.js
const { v4: uuidv4 } = require('uuid');
const { ApiKeyCredentials } = require('@azure/ms-rest-js');
// const { ComputerVisionClient } = require('@azure/cognitiveservices-computervision');
const sleep = require('util').promisify(setTimeout);
const { FormRecognizerClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");

const STATUS_SUCCEEDED = "succeeded";
const STATUS_FAILED = "failed"

async function readFileUrl(context, computerVisionClient, url) {

    try {

        context.log(`uri = ${url}`);

        // To recognize text in a local image, replace client.read() with readTextInStream() as shown:
        let result = await computerVisionClient.read(url);

        // Operation ID is last path segment of operationLocation (a URL)
        let operation = result.operationLocation.split('/').slice(-1)[0];

        // Wait for read recognition to complete
        // result.status is initially undefined, since it's the result of read
        while (result.status !== STATUS_SUCCEEDED) {
            await sleep(1000);
            result = await computerVisionClient.getReadResult(operation);
        }

        let contents = "";

        result.analyzeResult.readResults.map((page) => {
            page.lines.map(line => {
                contents += line.text + "\n\r"
            });
        });
        return contents;

    } catch (err) {
        console.log(err);
    }
}

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

        // extract the information from the businessCard

        // upload to CosmosDB

    } catch (err) {
        context.log(err);
        return;
    }

};