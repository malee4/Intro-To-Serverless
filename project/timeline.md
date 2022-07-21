# Project Idea
(Note, this idea has changed slightly since the Tuesday mentorship ideas meeting)
When traveling, going to conferences, or attending major events, keeping track of the business cards received can become difficult. This project seeks to provide an accessible, portable way to keep track of business cards. 

Cards are uploaded via SMS messaging (Twilio), their contents analyzed using the Microsoft Form Recognizer model to extract information, and relevant information is stored. 

Users will be able to view their stored cards via browser. Since this is a travel-oriented application, they will have the option to translate text on the business card as needed via Azure Cognitive Services Text Translator, as well as get additional information on the company via a Google search. (The search function is presently still up in the air.)

## Key Components
### Back-end
1. Read in image
2. Store business card + key information (JSON)
3. Translate information 
4. Return top 5 links in search for "Name" + " Business Name"

### Front-end
1. Twilio phone number to accept input images
2. Display stored cards on webpage (HTML)
3. Send request to translate information (needed input: language to translate to)
4. Send request to get more info on person in card (optional input: number of search results returned)

IF TIME: User "logins"
# Timeline

## Week 1

### Upload Component Development:

#### Description
- Create the store business cards Azure function
- That is, store as an image (with extension) in Blob storage, then download accordingly for processing

#### ETA:
> How long do you think it will take to complete this?
- 5 hours to complete Twilio --> Azure Function

#### Objective:
> Checklist of everything you need to do to complete this issue
- [ ] Take in image using the Twilio API
- [ ] Store in Blob Storage with corresponding file extension

## Week 2
### Get Card Information Development:

#### Description
- Continue to work on the taking in and processing of the card 
- Begin to develop information extraction functions
- Towards the end of the week: start considering what UI layout will look like (test implementations)

#### ETA:
- 4-5 hours for the development of a working function to read information from the card
- 1-2 hours to write a function that correctly calls the JSON from the CosmosDB
- 2-3 hours to write the function that retrieves information on the query from the Google API

#### Objective:
- Develop the function needed to read information from the card and store accordingly
- Begin to work on the Google search function

## Week 3
### Further Development of Information Extraction and Frontend

#### Description
- Create an understandable form of the HTML page with key functions
- Wrap up the Google search function
- If time, incorporate the translation function

#### ETA:
- 3-4 hours for HTML page set-up
- 2 hours for Google search function finalization

#### Objective:
- Use the rough framework from Week 2 to construct a minimally functioning webpage
- Start planning for the blog post and presentation

## Week 4
### Presentation Preparation and Clean-Up:

#### Description
- Prepare for the final presentations and finalization of deliverable products for BitProject.
- Record demo for blog post
- Continue working on frontend product
- If there is time, incorporate the translation function 

#### ETA:
- 3-4 hours on presentation preparation
- 1-2 hours for recording the demo

#### Objective:
- Write the blog post
- Complete preparation for the final presentation
- Any remaining troubleshooting


---

<details><summary>Task Template</summary>

<br><br>
</details>