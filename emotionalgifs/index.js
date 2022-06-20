const multipart = require('parse-multipart');
const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // here's your boundary:
    const boundary = multipart.getBoundary(req.headers['content-type']);
  
    // TODO: assign the body variable the correct value
    const body = req.body;

    // parse the body
    const parts = multipart.Parse(body, boundary);

    let result = await analyzeImage(parts[0].data);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            result
        }
    };
    console.log(result);
    context.done();
}



async function analyzeImage(img){
    // const subscriptionKey = process.env.SUBSCRIPTIONKEY;
    const subscriptionKey = 'f5d7cea6525d43ac9e47db93cc0e71d7';
    // const uriBase = process.env.ENDPOINT + '/face/v1.0/detect';
    const uriBase = 'https://melodysfaceapi.cognitiveservices.azure.com/' + '/face/v1.0/detect';

    let params = new URLSearchParams({
        'returnFaceId': 'true',
        'returnFaceAttributes': 'emotion'     //FILL IN THIS LINE
    })

    // specify the response
    let resp = await fetch(uriBase + '?' + params.toString(), {
        method: 'POST',  //WHAT TYPE OF REQUEST?
        body: img, //WHAT ARE WE SENDING TO THE API?
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    })
    let data = await resp.json();
    
    return data; 
}


