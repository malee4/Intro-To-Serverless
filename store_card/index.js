const { FormRecognizerClient, FormTrainingClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");
const fs = require("fs");

const fetch = require('node-fetch');
const mime = require('mime-types');
const { BlobServiceClient } = require("@azure/storage-blob");



module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    
    // return messages
    let responseMessage = "";
    let responseStatus = "200";

    // take in image as POST
    const url = req.body.url;
    const picName = req.body.picname;

    try {
        // get the response from the Twilio URL
        const response = await fetch(url);

        // if fetch is not successful
        if (!response.ok) {
            throw new Error(`unexpected response ${response.statusText}`);
        }

        // get the type of file (ex. jpeg)
        const mimeType = response.headers.get('content-type')

        // set the file name with the file type extension appended at the end
        const fileName = `${picName}.${mime.extension(mimeType)}`

        // connect to Blob Storage
        const blobContainerName = "businesscardstorage";
        const blobServiceClient = await BlobServiceClient.fromConnectionString(process.env["AZURE_STORAGE_CONNECTION_STRING"]);
        const containerClient = await blobServiceClient.getContainerClient(blobContainerName);
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);

        const uploadBlobResponse = await blockBlobClient.uploadStream(
            response.body,
            10 * 1024 * 1024,
            20,
            {
                blobHTTPHeaders: {
                    blobContentType: mimeType,
                },
            }
        );

        responseMessage = `Status of Upload to Blob storage is: ${uploadBlobResponse._response.status}`;

    }
    catch (error) {
        context.log(error);
        responseMessage = error;
        responseStatus = 500;
    }

    context.res = {
        body: infoJSON,
    };
}


// get information from card using Azure Form Recognizer model
async function getInfo(url) {
    const endpoint = process.env.FORM_RECOGNITION_ENDPOINT
    const apiKey = process.env.FORM_RECOGNITION_KEY
    
    const client = new FormRecognizerClient(endpoint, new AzureKeyCredential(apiKey));
    const poller = await client.beginRecognizeBusinessCardsFromUrl(url, {
    includeFieldElements: true,
    onProgress: (state) => {
        console.log(`analyzing status: ${state.status}`);
    }
    });
    const [businessCard] = await poller.pollUntilDone();

    // make sure info returned is not null
    if (businessCard === undefined) {
        throw new Error("Failed to extract data from at least one business card.");
    }

    return businessCard;
}

// upload JSON to CosmosDB
async function upload(JSON_FILE) {
    return NaN
}