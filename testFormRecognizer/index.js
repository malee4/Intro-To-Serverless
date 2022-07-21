const endpoint = process.env.FORM_RECOGNITION_ENDPOINT
const apiKey = process.env.FORM_RECOGNITION_KEY
const path = "/Users/melod/Desktop/cs/Intro-To-Serverless/testFormRecognizer/cardImage.jpg";

const { FormRecognizerClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");
const fs = require("fs");

// // BUSINESS CARD MODEL
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const queryObject = querystring.parse(req.body);

    // testing purposes
    const bcUrl = queryObject.MediaUrl0;

    const client = new FormRecognizerClient(endpoint, new AzureKeyCredential(apiKey));

    // bcUrl = "https://static.gotprint.com/tl/products/generic/images/business-cards/business_card_rounded_h.jpg";
    const poller = await client.beginRecognizeBusinessCardsFromUrl(bcUrl, {
        onProgress: (state) => {
            console.log(`status: ${state.status}`);
        }
    });

    const [businessCard] = await poller.pollUntilDone();

    if (businessCard === undefined) {
        throw new Error("Failed to extract data from at least one business card.");
    }


    // const readStream = fs.createReadStream(path);

    // const client = new FormRecognizerClient(endpoint, new AzureKeyCredential(apiKey));
    // const poller = await client.beginRecognizeBusinessCards(readStream, {
    //     onProgress: (state) => {
    //     console.log(`status: ${state.status}`);
    //     }
    // });

    // const cards = await poller.pollUntilDone();

    // if (!cards || cards.length <= 0) {
    //     throw new Error("Expecting at lease one card in analysis result");
    // }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: businessCard
        };
}

// GENERAL FORM RECOGNIZER MODEL
// module.exports = async function(context, req) {
//     context.log('JavaScript HTTP trigger function processed a request.');

//     const readStream = fs.createReadStream(path);

//     const client = new FormRecognizerClient(endpoint, new AzureKeyCredential(apiKey));
//     const poller = await client.beginRecognizeContent(readStream);
//     const pages = await poller.pollUntilDone();

//     context.res = {
//         // status: 200, /* Defaults to 200 */
//         body: pages[0]
//     };
// }
