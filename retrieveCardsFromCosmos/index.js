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

  return items;
}


module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let body = "empty";
    const reqType = req.query['reqType'];
    context.log(reqType)
    let items = await getCards()
    console.log(items)

  
    

    if (reqType === 'nameList') {
      context.log("Returning list of names");
      let count = 0

      let names = {}

      for (let i = 0; i < items.length; i++) {
        let card = items[i]
        //console.log(card)
        let cardName = ""
        try {
          cardName = card.contactName
        } catch(err) {
          console.log(err)
        }
        try {
          cardName = cardName + ", " +  card.companyName;
        } catch(err) {
          console.log(err)
        }
        names[cardName] = count;
        count = count + 1;
        
      };
      context.log(names)
      
      body = names;
    } else if (reqType === 'cardImage') {
      context.log("Returning the card requested")
      let cardIndex = req.query['cosmosIndex'];
      body = items[cardIndex]
    } else {
      body = {}
      console.log("Please input a valid request type")
    }

    context.log(body)

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: body
    };
}


