var multipart = require("parse-multipart")
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var boundary = multipart.getBoundary(req.headers['content-type']);
    context.log("getting request")
    var body = req.body; // let's say it returns a FormData object
    var bodyType = typeof body;
    var responseMessage = "";

    var parsedBody = "hello";

    // catch cases where an empty POST request is passed
    try {
        // actual data 
        parsedBody = multipart.Parse(body, boundary);
        context.log("successfully parsed body")

        // first, determine your file extension
        let filetype = parsedBody[0].type;
        context.log("successfully got body type")
        let ext;
        if (filetype == "image/png") {
        ext = "png";
        } else if (filetype == "image/jpeg") {
            ext = "jpeg";
        } else if (filetype == "image/jpg") {
            ext = "jpg";
        } else {
            username = "invalidimage"
            ext = "";
        }

        // get info from headers
        let fileName = req.headers['codename'];

        // call the uploadFile function
        responseMessage = await uploadFile(parsedBody, ext, fileName);

    } catch(err) {
        context.log(err);
        context.log("Undefined body image");
        responseMessage = "Sorry! No image attached."
    }
    
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}

// background function, sends file over
async function uploadFile(parsedBody, ext, fileName) {
    // "reference to the container"
    // gets the opening to interact with cleint
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerName = "images";
    // the actual client used to interact with the container
    const containerClient = blobServiceClient.getContainerClient(containerName);    // Get a reference to a container

    // create the blob
    const blobName = `${fileName}.${ext}`;    // ext = extension
    const blockBlobClient = containerClient.getBlockBlobClient(blobName); // Get a block blob client

    // upload the file
    const uploadBlogResponse = await blockBlobClient.upload(parsedBody[0].data, parsedBody[0].data.length);
    return "File Saved";
}