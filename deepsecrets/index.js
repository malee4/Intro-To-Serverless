const qs = require('qs');
const CosmosClient = require("@azure/cosmos").CosmosClient;

const config = {
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY,
    databaseId: "SecretStorer",
    containerId: "secrets",
    partitionKey: {kind: "Hash", paths: ["/secrets"]}
  };

/*
// This script ensures that the database is setup and populated correctly
*/
async function create(client, databaseId, containerId) {
  const partitionKey = config.partitionKey;

  /**
   * Create the database if it does not exist
   */
  const { database } = await client.databases.createIfNotExists({
    id: databaseId
  });
  console.log(`Created database:\n${database.id}\n`);

  /**
   * Create the container if it does not exist
   */
  const { container } = await client
    .database(databaseId)
    .containers.createIfNotExists(
      { id: containerId, partitionKey },
      { offerThroughput: 400 }
    );

  console.log(`Created container:\n${container.id}\n`);
}


// create a new document within the database container that contains the newItem data
async function createDocument(newItem) {
    const { endpoint, key, databaseId, containerId } = config;

    // connect to CosmosDB database
    const client = new CosmosClient({ endpoint, key });

    const database = client.database(databaseId);
    const container = database.container(containerId);

    // Make sure Tasks database is already setup. If not, create it.
    await create(client, databaseId, containerId);

    // get the most recent 
    console.log(`Querying container: Items`);

    // query to return top items, organized by time stamp column (c._ts)
    const querySpec = {
    query: "SELECT * FROM c"
    };

    // read all items in the Items container
    const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();

    /** Create new item
     * newItem is defined at the top of this file
     */
    const { resource: createdItem } = await container.items.create(newItem);

    console.log(`\r\nCreated new item: ${createdItem.id} - ${createdItem.description}\r\n`);


    return items;
}

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log(req.body);
    const queryObject = qs.parse(req.body);
    let message = queryObject.Body; // user's input
    let document = {"message": message} // now in json form
    let items = await createDocument(document);
    let random_value = Math.floor(items.length * Math.random());

    // formats text output for your user
    const responseMessage = `Thanks 😊! Stored your secret "${message}". 😯 Someone confessed that: ${JSON.stringify(items[random_value].message)}`

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}

