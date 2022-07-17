// const qs = require('qs');

// module.exports = async function (context, req) {
//         context.log('JavaScript HTTP trigger function processed a request.');
//         const queryObject = qs.parse(req.body);
//         const url = queryObject.MediaUrl0;
    
//         context.res = {
//             body: url,
//         };
//     }

const qs = require('qs');
const CosmosClient = require("@azure/cosmos").CosmosClient;
const fetch = require('node-fetch');
const { FormRecognizerClient, FormTrainingClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");
const fs = require("fs");

// const config = {
//     endpoint: process.env.COSMOS_ENDPOINT,
//     key: process.env.COSMOS_KEY,
//     databaseId: "BusinessCardStorer",
//     containerId: "cards",
//     partitionKey: {kind: "Hash", paths: ["/secrets"]}
//   };


module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // take in image as POST
    const queryObject = qs.parse(req.body);
    const url = queryObject.MediaUrl0; // Q: what is this returning?
    // const resp = await fetch(url, {
    //     method: "GET",
    // });

    // const data = await resp.arrayBuffer();

    // const typeIs = typeof data

    // get card information, pass in image location --> uncertain if this works
    let infoJSON = await getInfo(url);

    // turn into base64 file
    // const cardBase64 = Buffer.from(data).toString('base64');

    // append to json
    // infoJSON["base64"] = cardBase64;

    // store json in CosmosDB 
    

    // let respMessage = "Thanks!";

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