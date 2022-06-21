const querystring = require('qs');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // gets the body of your URL. Ex. /username=John, where username = key, John = value
    // parses and returns as a json object that contains actual key value pairs
    const queryObject = querystring.parse(req.body);

    // testing purposes
    const url = queryObject.MediaUrl0;
    context.log(url);

    context.res = {
        // first item of media that is texted
        body: url,
    };
}