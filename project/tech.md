# Technologies

### Azure Services

**Name of Service**
- [Azure Form Recognizer](https://docs.microsoft.com/en-us/azure/applied-ai-services/form-recognizer/concept-business-card) to read information from the card, which is then saved in the Cosmos DB storage.
- [Azure Cognitive Services Translator](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/) to translate any relevant information on business cards (taken in via Twilio API) in foreign languages.

### APIs

**Name of API**
- [Google Search API](https://rapidapi.com/apigeek/api/google-search3/) to return additional information on the person shown in the API by conducting a background information search on information extracted from the business cards.
- [Twilio API](https://www.twilio.com/docs/usage/api) to send in images of business cards collected.

### Packages/Libraries/Databases

**Name of Packages/Library/Database**
- [Cosmos DB](https://docs.microsoft.com/en-us/azure/cosmos-db/introduction) to store information on the business cards.

### Front-end Languages

**Name of Language**
- Node.js/Javascript (this is back-end, included here for organizational purposes)
- HTML (frontend development)

### Flowchart

[Replace with image of final flowchart]


### Relevant Links
- [Using v3.0 of Azure Form Recognizer](https://docs.microsoft.com/en-us/azure/applied-ai-services/form-recognizer/v3-migration-guide)
- [W-2 Form Preview Documentation](https://docs.microsoft.com/en-us/azure/applied-ai-services/form-recognizer/concept-w2)