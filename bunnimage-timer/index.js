const { BlobServiceClient } = require("@azure/storage-blob");
const connectionstring = process.env["AZURE_STORAGE_CONNECTION_STRING"]
const account = "melodybitstorageaccount";


module.exports = async function (context, myTimer) {
    // fetch the container ("create contact")
    const blobServiceClient = await BlobServiceClient.fromConnectionString(connectionstring);
    const deletecontainer = "images"; // images is the container whose files we want to alter
    const blobContainerClient = await blobServiceClient.getContainerClient(deletecontainer); // get the actual container from the service client

    // iterate through the blobs in the list
    for await (const blob of blobContainerClient.listBlobsFlat()) {
        context.log(`Deleting blob name ${blob.name}`);

        // using the deleteBlob method
        await blobContainerClient.deleteBlob(blob.name);
    }

    // alert user of successful completion of for-loop
    context.log("Deleted all files from the container.");
};