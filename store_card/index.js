// const { FormRecognizerClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");
// const fs = require("fs");

// const endpoint = process.env.FORM_RECOGNITION_ENDPOINT
// const apiKey = process.env.FORM_RECOGNITION_KEY
// const client = new FormRecognizerClient(endpoint, new AzureKeyCredential(apiKey));

// module.exports = async function (context, req) {
//     bcUrl = "https://github.com/Azure-Samples/cognitive-services-REST-api-samples/curl/form-recognizer/businessCard.png";
//     const poller = await client.beginRecognizeBusinessCardsFromUrl(bcUrl, {
//         onProgress: (state) => {
//             console.log(`status: ${state.status}`);
//         }
//     });

//     const [businessCard] = await poller.pollUntilDone();

//     if (businessCard === undefined) {
//         throw new Error("Failed to extract data from at least one business card.");
//     }

//     context.res = {
//         body: businessCard,
//     };
// }





// recognizeBusinessCards().catch((err) => {
//     console.error("The sample encountered an error:", err);
// });





// ORIGINAL CODE
const { PrebuiltModels } = require("@azure/ai-form-recognizer");
const fs = require("fs");
const querystring = require('qs');
const urlUtil = require('url');

const fetch = require('node-fetch');
const mime = require('mime-types');
const { BlobServiceClient } = require("@azure/storage-blob");

// configuration for CosmosDB account
// const config = {
//     endpoint: process.env.COSMOS_ENDPOINT,
//     key: process.env.COSMOS_KEY,
//     databaseId: "SecretStorer",
//     containerId: "secrets",
//     partitionKey: {kind: "Hash", paths: ["/secrets"]}
//   };

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    
    // return messages
    let responseMessage = "hello";
    let responseStatus = "200";

    // take in image as POST
    // context.log("before req.body.url")
    // const queryObject = querystring.parse(req.body);
    // const url = queryObject.MediaUrl0;
    // const picname = "hello"

    // const url = req.body.url;
    // context.log(url);
    // const url = "https://api.twilio.com/2010-04-01/Accounts/ACa8f74b34174b5d9b3380c97c0988885a/Messages/MM3829c6dcd13b80ab13ba8ff7a7d3cef1/Media/MEdf211d5a5752d943b5ac9a6aa14ecb8b";
    const queryObject = querystring.parse(req.body);
    const url = queryObject.MediaUrl0;

    const picName = req.body.picname;
    // const picName = "hello";

    //const url = req.body["MediaUrl0"];

    try {
        // get the response from the Twilio URL
        const response = await fetch(url);
        context.log("fetched url successfully")

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
        body: responseMessage,
    };
}


// get information from card using Azure Form Recognizer model
async function getInfo(img) {
    const endpoint = process.env.FORM_RECOGNITION_ENDPOINT
    const key = process.env.FORM_RECOGNITION_KEY
    
    const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));
    const poller = await client.beginAnalyzeDocument(PrebuiltModels.BusinessCard, img);

    const {
        documents: [result]
    } = await poller.pollUntilDone();

    if (result) {
        const card = result.fields;
    } else {
        throw new Error("Expected at least one card in the result.");
    }

    return result;


    // const client = new FormRecognizerClient(endpoint, new AzureKeyCredential(apiKey));
    // const poller = await client.beginRecognizeBusinessCardsFromUrl(businessCardImage, {
    // includeFieldElements: true,
    // onProgress: (state) => {
    //     console.log(`analyzing status: ${state.status}`);
    // }
    // });
    // const [businessCard] = await poller.pollUntilDone();

    // // make sure info returned is not null
    // if (businessCard === undefined) {
    //     throw new Error("Failed to extract data from at least one business card.");
    // }

    // return businessCard;
}