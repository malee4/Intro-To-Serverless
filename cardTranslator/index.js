// get the packages
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // get the language being requested (via POST)
    const lang = req.headers['language'];
    console.log(lang)
    const inText = req.body//.json()
    console.log(inText)

    // get the JSON of the translated text
    const outText = await translate(inText, lang);
    console.log(outText);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: outText
    };
}

async function translate(text, toLanguage) {
    let endpoint = new URL(process.env.TEXT_TRANSLATOR_ENDPOINT + 'translate');
    context.log(endpoint)
    let key = process.env.TRANSLATOR_KEY;
    let location = "East US";

    const resp = await fetch(endpoint, {
        method:'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': key,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        params: {
            'api-version': '3.0',
            'to': ['en']
        }, 
        body: [{
            'text': 'hola mi nombre es melodia'
        }],
        responseType: 'json'
    });


    // const resp = await fetch(endpoint + 'translate', {
    //     method: 'POST',
    //     headers: {
    //         'Ocp-Apim-Subscription-Key': key,
    //         'Content-type': 'charset=UTF-8'//'application/json'
    //     },
    //     params: {
    //         'api-version': '3.0',
    //         'to': [toLanguage]
    //     },
    //     data: [text],
    //     responseType: 'json'
    // });

    let data = await resp.json();

    return data

}