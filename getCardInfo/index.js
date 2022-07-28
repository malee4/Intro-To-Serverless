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
        // upload to Cosmos DB 
        if (businessCard) {
            context.bindings.outputDocument = JSON.stringify({
                // create a random ID
                id: new Date().toISOString() + Math.random().toString().substring(2, 10),
                contactName: name,
                companyName: businessCard.fields.CompanyNames.value[0].value,
                address: businessCard.fields.Addresses.value[0].value,
                email: businessCard.fields.Emails.value[0].value,
                website: businessCard.fields.Websites.value[0].value,
                fax: businessCard.fields.Faxes.value[0].value,
                otherPhones: businessCard.fields.OtherPhones.value[0].value,
                cardUrl: context.bindingData.uri
            });
        }

        // IF TIME: reorganize info from businessCard

        // upload to CosmosDB (TO DO: add image file)
        // context.log("Uploading JSON");
        // // let uploadMessage = await uploadJSON(businessCard, context.bindingData.uri);
        // let uploadMessage = await uploadJSON(businessCard);
        // context.log(uploadMessage);

    } catch (err) {
        context.log(err);
        return;
    }
};

// // configuration for Cosmos DB upload
// const config = {
//     endpoint: process.env.COSMOS_ENDPOINT,
//     key: process.env.COSMOS_KEY,
//     databaseId: "BusinessCardInfoStorer",
//     containerId: "cards",
//     partitionKey: {kind: "Hash", paths: ["/category"]}
// };

// // This script ensures that the database is setup and populated correctly
// async function create(client, databaseId, containerId) {
//     try {
//         const partitionKey = config.partitionKey;
  
//         // create the database if it does not exist
//         const { database } = await client.databases.createIfNotExists({
//         id: databaseId
//         });
//         console.log(`Created database:\n${database.id}\n`);
    
//         // create the container if it does not exist
//         const { container } = await client
//         .database(databaseId)
//         .containers.createIfNotExists(
//             { id: containerId, partitionKey },
//             { offerThroughput: 400 }
//         );
    
//         console.log(`Created container:\n${container.id}\n`);
//         return;
//     } catch (err) {
//         context.log(err);
//         return;
//     }
    
// }

// //async function uploadJSON(businessCard, URL) {
// async function uploadJSON(businessCard) {
//     // businessCard['CARD_URL'] = URL;

//     try {
//         // append the url to the businessCard json
//         const { endpoint, key, databaseId, containerId } = config;
//         const client = new CosmosClient({ endpoint, key });
//         const database = client.database(databaseId);
//         const container = database.container(containerId);

//         await create(client, databaseId, containerId);

//         // add the businessCard to the cosmos DB container
//         const { resource: createdItem } = await container.items.create(businessCard);
//         console.log(`\r\nUploaded new card: ${createdItem.id} - ${createdItem.description}\r\n`);
//         return "Finished upload";
//     } catch (err) {
//         context.log(err.message);
//         return;
//     }
    
// }