var multipart = require("parse-multipart")
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');


    const boundary = multipart.getBoundary(req.headers['content-type']);
    const body = req.body;
    // actual data 
    const parsedBody = multipart.Parse(body, boundary);

    // first, determine your file extension
    let filetype = parsedBody[0].type;
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

    // call the uploadFile function
    let responseMessage = await uploadFile(parsedBody, ext);
    
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}

// background function, sends file over
async function uploadFile(parsedBody, ext) {
    // "reference to the container"
    // gets the opening to interact with cleint
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerName = "images";
    // the actual client used to interact with the container
    const containerClient = blobServiceClient.getContainerClient(containerName);    // Get a reference to a container

    // create the blob
    const blobName = 'test.' + ext;    // ext = extension
    const blockBlobClient = containerClient.getBlockBlobClient(blobName); // Get a block blob client

    // upload the file
    const uploadBlogResponse = await blockBlobClient.upload(parsedBody[0].data, parsedBody[0].data.length);
    return "File Saved";
}