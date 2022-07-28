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
        
        let cardInfo = {
            id: new Date().toISOString() + Math.random().toString().substring(2, 10),
            cardUrl: context.bindingData.uri
        }

        try {
            let name = businessCard.fields.ContactNames.value[0].value.FirstName.value + " " + businessCard.fields.ContactNames.value[0].value.LastName.value;
            if (name != undefined) {
                cardInfo["contactName"] = name
            }
        } catch(err){
            console.log(err)
        }
        
        try {
            if (businessCard.fields.CompanyNames.value[0].value != undefined) {
                cardInfo["companyName"] = businessCard.fields.CompanyNames.value[0].value
            }
        } catch(err) {
            console.log(err)
        }
        
        try {
            if (businessCard.fields.Addresses.value[0].value != undefined) {
                cardInfo["address"] = businessCard.fields.Addresses.value[0].value
            }
        } catch(err) {
            console.log(err)
        }
        
        try {
            if (businessCard.fields.Emails.value[0].value != undefined) {
                cardInfo["email"] = businessCard.fields.Emails.value[0].value
            }
        } catch(err) {
            console.log(err)
        }
        
        try {
            if (businessCard.fields.Websites.value[0].value != undefined) {
                cardInfo["website"] = businessCard.fields.Websites.value[0].value
            }
        } catch(err) {
            console.log(err)
        }
        console.log("I've finished trying websites")
        try {
            if (businessCard.fields.Faxes.value[0].value != undefined) {
                cardInfo["fax"] = businessCard.fields.Faxes.value[0].value
            }
        } catch(err) {
            console.log(err)
        }
        
        try {
            if (businessCard.fields.OtherPhones.value[0].value != undefined) {
                cardInfo["otherPhones"] = businessCard.fields.OtherPhones.value[0].value
            }
        } catch(err) {
            console.log(err)
        }
        
        try {
            if (businessCard) {
                context.bindings.outputDocument = JSON.stringify(cardInfo);
            }
        } catch(err) {
            console.log(err)
        }
        
    } catch (err) {
        context.log(err);
        return;
    }
};
