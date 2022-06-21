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

    let emotions = result[0].faceAttributes.emotion;
    let objects = Object.values(emotions);
    const main_emotion = Object.keys(emotions).find(key => emotions[key] === Math.max(...objects));

    const resp = await fetch("https://api.giphy.com/v1/gifs/translate?api_key=GNM2DQMiDTZBqow3ZA2wTgduVtuRNd4M&limit=1&s=" + main_emotion);
    const jsonData = await resp.json();
    
    context.log(jsonData);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: 
            jsonData.data.url
        
    };
    console.log(result);
    context.done();
}



async function analyzeImage(img){
    const subscriptionKey = process.env.SUBSCRIPTIONKEY;
    const uriBase = process.env.ENDPOINT + '/face/v1.0/detect';
    // const subscriptionKey = 'f5d7cea6525d43ac9e47db93cc0e71d7';
    // const uriBase = 'https://melodysfaceapi.cognitiveservices.azure.com/' + '/face/v1.0/detect';

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


