const { v4: uuidv4 } = require('uuid');
const sleep = require('util').promisify(setTimeout);
const { FormRecognizerClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");

const config = {
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY,
    databaseId: "BusinessCardInfoStorer",
    containerId: "cards",
    partitionKey: {kind: "Hash", paths: ["/cards"]}
  };

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

        // IF TIME: reorganize info from businessCard

        // upload to CosmosDB



    } catch (err) {
        context.log(err);
        return;
    }

};