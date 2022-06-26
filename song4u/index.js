const querystring = require('qs');
const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // gets the body of your URL. Ex. /username=John, where username = key, John = value
    // parses and returns as a json object that contains actual key value pairs
    const queryObject = querystring.parse(req.body);

    // testing purposes
    const url = queryObject.MediaUrl0;
    
    context.log(url);

    const resp = await fetch(url, {
        method: "GET",
    });

    const data = await resp.arrayBuffer();

    const result = await analyzeImage(data);

    // context.log(result);

    let age = result[0].faceAttributes.age

    let id = "";

    if (age > 5 && age < 25) {
        id = "GenZ"
    } else if (age > 24 && age < 41) {
        id = "GenY"
    } else if (age > 40 && age < 57) {
        id = "GenX"
    } else if (age > 56 && age < 76) {
        id = "BabyBoomers"
    } else {
        id = "Unknown"
    }

    context.log(id);

    context.res = {
        // first item of media that is texted
        body: url
    };
};

async function analyzeImage(img) {
    // local_settings.json
    const KEY = process.env["FACE_API_KEY"];
    const URI_BASE =  process.env["FACE_API_URI"] + "/face/v1.0/detect";

    context.log(URI_BASE)

    const params = new URLSearchParams({
        returnFaceId: "true",
        returnFaceAttributes: "age"
    })

    const resp = await fetch(URI_BASE + '?' + params.toString(), {
        method: 'POST',
        body: img,
        headers: {
            'Content-Type' : 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': KEY
        }
    })

    let data = await resp.json();

    return data;
}