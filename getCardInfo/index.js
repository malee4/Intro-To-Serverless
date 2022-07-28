// for reading information from the card
const { v4: uuidv4 } = require('uuid');
const sleep = require('util').promisify(setTimeout);
const { FormRecognizerClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");

// // for uploading to CosmosDB
// const CosmosClient = require("@azure/cosmos").CosmosClient;

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
        let name = businessCard.fields.ContactNames.value[0].value.FirstName.name + " " + businessCard.fields.ContactNames.value[0].value.LastName.name;
        
        let cardInfo = {
            id: new Date().toISOString() + Math.random().toString().substring(2, 10),
            cardUrl: context.bindingData.uri
        }

        if (name != undefined) {
            cardInfo["contactName"] = name
        }
        if (businessCard.fields.CompanyNames.value[0].value != undefined) {
            cardInfo["companyName"] = businessCard.fields.CompanyNames.value[0].value
        }
        if (businessCard.fields.Addresses.value[0].value != undefined) {
            cardInfo["address"] = businessCard.fields.Addresses.value[0].value
        }
        if (businessCard.fields.Emails.value[0].value != undefined) {
            cardInfo["email"] = businessCard.fields.Emails.value[0].value
        }
        if (businessCard.fields.Websites.value[0].value != undefined) {
            cardInfo["website"] = businessCard.fields.Websites.value[0].value
        }
        if (businessCard.fields.Faxes.value[0].value != undefined) {
            cardInfo["fax"] = businessCard.fields.Faxes.value[0].value
        }
        if (businessCard.fields.OtherPhones.value[0].value != undefined) {
            cardInfo["otherPhones"] = businessCard.fields.OtherPhones.value[0].value
        }
        
        
        
        
        // upload to Cosmos DB 
        if (businessCard) {
            context.bindings.outputDocument = JSON.stringify(cardInfo);
        }

    } catch (err) {
        context.log(err);
        return;
    }
};
