const fetch = require('node-fetch');

const API_KEY = process.env.GOOGIO_API_KEY;

function getURL(queryName, api_url) {
    let out = api_url;
    let queryList = queryName.split(" ");

    for (let i = 0; i < queryList.length; i++) {
        if (i == queryList.length - 1) {
            out += queryList[i] + "hl=en?";
        } else {
            out += queryList[i] + "+";
        }
    }
    return out
}


module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let responseMessage = "";

    try {
        // generate the fetch url
        const api_url = "https://api.goog.io/v1/search/q=";
        const queryName = req.query['q']; // search is separated by spaces
        const url = getURL(queryName, api_url);

        let resp = await fetch(url, {
            method: 'GET',
            headers: {
                'apikey':process.env.GOOGIO_API_KEY
            }
        });

        let data = await resp.json();

        context.log(data);

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: data
        };

    } catch (error) {
        context.log(error);
        responseMessage = error;
        responseStatus = 500;
    }
    // GET https://api.goog.io/v1/search/{query}

    
}