// get the packages
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // get the language being requested (via POST)
    const lang = req.query['language'];
    const inText = req.body//.json()

    // get the JSON of the translated text
    const outText = await translate(inText, lang);
    console.log(outText);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}

async function translate(text, toLanguage) {
    let endpoint = process.env.TRANSLATOR_ENDPOINT;
    let key = process.env.TRANSLATOR_KEY;
    let location = "East US";

    const resp = await fetch(endpoint + 'translate', {
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': key,
            'Ocp-Apim-Subscription-Region': location,
            'Content-type': 'application/json'
        },
        params: {
            'api-version': '3.0',
            'to': [toLanguage]
        },
        data: [text],
        responseType: 'json'
    });

    let data = await resp.json();

    return data

}