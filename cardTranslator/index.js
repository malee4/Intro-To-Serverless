// get the packages
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // get the language being requested (via POST)
    const lang = req.headers['language'];
    console.log(lang)
    const inText = req.body//.json() // should be a json object
    console.log(inText)

    // get the JSON of the translated text
    const outText = await translate(inText, lang);
    
    console.log(outText);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: outText
    };
}

// translate the text
async function translate(text, toLanguage) {
    let endpoint = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0";
    let url = endpoint + "&to=" + toLanguage
    let key = process.env.TRANSLATOR_KEY;
    let location = "eastus"

    let resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': key,
            'Ocp-Apim-Subscription-Region': location,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        body: JSON.stringify(text),
    })
    
    let data = await resp.json();

    let translations = data[0].translations

    return translations

}