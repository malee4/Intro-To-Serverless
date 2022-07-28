const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');

let key = process.env.TRANSLATOR_KEY;
    let endpoint = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0";
    let location = "eastus";

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    // let lang = req.query["toLang"]
    let lang = "en"
    let url = endpoint + "&to=" + lang;

    let resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': key,
            'Ocp-Apim-Subscription-Region': location,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        body: JSON.stringify([{
            'text': 'Hello, friend! What did you do today?',

        }]),
    })
    
    let data = await resp.json();

    let translation = data[0].translations


    context.log(data)
    
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: translation
    };
}