const fetch = require("node-fetch");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // takes in username from the header
    // difference between .query and .headers in HTML?
    const username = req.headers['username'];

    let download = ""
    let downloadpng = "https://melodybitstorageaccount.blob.core.windows.net/images/" + username + ".png";
    let downloadjpg = "https://melodybitstorageaccount.blob.core.windows.net/images/" + username + ".jpeg";

    // assumes there is an image success = true, else false
    var success = true;

    // test if link works
    // calls link using "GET" method
    // why set these as two separate variables?
    let pngresp = await fetch(downloadpng, {
        method: 'GET',
     })
     let pngdata = await pngresp;
     
     let jpgresp = await fetch(downloadjpg, {
        method: 'GET',
     })
     let jpgdata = await jpgresp;

     // return whether link exists
     // does this logic not account for if both png and jpg exist?
     if (pngdata.statusText == "The specified blob does not exist." && jpgdata.statusText == "The specified blob does not exist." ) {
        success = false;
        context.log("Does not exist: " + pngdata)
        context.log("Does not exist: " + jpgdata)
     } else if (pngdata.statusText != "The specified blob does not exist.") {
        success = true;
        download = downloadpng
        context.log("Does exist: " + pngdata)
     } else if (jpgdata.statusText != "The specified blob does not exist.") {
        success = true;
        download = downloadjpg
        context.log("Does exist: " + jpgdata)
     }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            "downloadUri": download,
            "success": success,
        }
    };

    context.log(download);
    context.done(); // purpose of context.done?
}