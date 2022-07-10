const fetch = require('node-fetch')

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

   

    const name1 = req.query.name1;
    const name2 = req.query.name2;
    const name3 = req.query.name3;
    const name4 = req.query.name4;

    const cat1 = await getCatPic(name1);
    const cat2 = await getCatPic(name2);
    const cat3 = await getCatPic(name3);
    const cat4 = await getCatPic(name4);

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: { 
            cat1: cat1,
            cat2: cat2,
            cat3: cat3,
            cat4: cat4,
        }
    };
}

async function getCatPic(name) {
    const resp = await fetch(`https://cataas.com/cat/cute/says/${name}`, {
    method: 'GET'
    });

    const data = await resp.arrayBuffer()
    // we need to receive it as a buffer since this is an image we are receiving from the API
    // Buffer?? https://developer.mozilla.org/en-US/docs/Web/API/Blob

    var base64data = Buffer.from(data).toString('base64')
    //put what you want to turn into base64 inside "originaldata"
    //"originaldata" will be encoded in base64.
    return base64data
}

 // function getNames() {
    //     // "Shreya, Emily, Fifi, Beau, Evelyn, Julia, Daniel, Fardeen"
    //     var names = ["Shreya", "Emily", "Fifi", "Beau", "Evelyn", "Julia", "Daniel", "Fardeen"]
    //     // general a random number
    //     var random_value = Math.floor(names.length * Math.random())
    //     var resultname = names[random_value] // get the name
    //     return resultname
    // }