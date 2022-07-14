const querystring = require('qs');
const fetch = require('node-fetch');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // gets the body of your URL. Ex. /username=John, where username = key, John = value
    // parses and returns as a json object that contains actual key value pairs
    const queryObject = querystring.parse(req.body);

    context.log(typeof queryObject);

    // testing purposes
    const url = queryObject.MediaUrl0;
    
    context.log(url);

    const resp = await fetch(url, {
        method: "GET",
    });

    const data = await resp.arrayBuffer();
    context.log(typeof data);

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

    // context.log(id);

    // each generation corresponds with a unique spotify url
    const songs = {
        "GenZ":"https://open.spotify.com/track/0SIAFU49FFHwR3QnT5Jx0k?si=1c12067c9f2b4fbf", 

        "GenY":"https://open.spotify.com/track/1Je1IMUlBXcx1Fz0WE7oPT?si=a04bbdf6ec4948b9", 

        "GenX":"https://open.spotify.com/track/4Zau4QvgyxWiWQ5KQrwL43?si=790d9e3ef2ed408d", 

        "BabyBoomers":"https://open.spotify.com/track/4gphxUgq0JSFv2BCLhNDiE?si=1abb329f2dc24f50", 

        "Unknown":"https://open.spotify.com/track/5ygDXis42ncn6kYG14lEVG?si=84b49b41d09d4d11"}

    const val = songs[id]

    // the message that will be returned to the message sender
    const message = `We guessed you're part of this generation: ${id}! Happy listening! ${val}`;

    context.res = {
        // first item of media that is texted
        body: message
    };
};

async function analyzeImage(img) {
    // local_settings.json
    const KEY = process.env["FACE_API_KEY"];
    const URI_BASE = new URL("/face/v1.0/detect", process.env["FACE_API_URI"]);

    // context.log(URI_BASE)

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