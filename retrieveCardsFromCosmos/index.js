const qs = require('qs');
const CosmosClient = require("@azure/cosmos").CosmosClient;

const config = {
    endpoint: process.env.COSMOS_BUSINESSCARD_ENDPOINT,
    key: process.env.COSMOS_BUSINESSCARD_KEY,
    databaseId: "my-database",
    containerId: "my-container",
    partitionKey: {kind: "Hash", paths: ["/cards"]}
}

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

async function getCards() {
  const {endpoint, key, databaseId, containerId} = config;
  console.log("client successfully retrieved")
  const client = new CosmosClient({endpoint, key});
  const database = client.database(databaseId);
  const container = database.container(containerId);
  

  // make sure database is already set up. If not, create it.
  await create(client, databaseId, containerId);

  const querySpec = {
      query: "SELECT * FROM c"
  };

  // read all items
  const {resources: items } = await container.items.query(querySpec).fetchAll();

  console.log(items)

}


module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let items = await getCards()
    context.log(items)

    let count = 0

    let names = {}

    for (card in items) {
      names[count] = 
      count = count + 1;
    }
    
    context.log(names)


    const responseMessage = "";
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}


