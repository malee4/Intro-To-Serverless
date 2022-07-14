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

### Basic Function Development:

#### Description
- 

#### ETA:
> How long do you think it will take to complete this?
- [Replace with eta]

#### Objective:
> Checklist of everything you need to do to complete this issue
- [ ] [Replace with small task  1]
- [ ] [Replace with small task  2]
- [ ] [Replace with small task  3]

## Week 2
### [Task Name]:

#### Description
- [Replace with description]

#### ETA:
> How long do you think it will take to complete this?
- [Replace with eta]

#### Objective:
> Checklist of everything you need to do to complete this issue
- [ ] [Replace with small task  1]
- [ ] [Replace with small task  2]
- [ ] [Replace with small task  3]

## Week 3
### [Task Name]:

#### Description
- [Replace with description]

#### ETA:
> How long do you think it will take to complete this?
- [Replace with eta]

#### Objective:
> Checklist of everything you need to do to complete this issue
- [ ] [Replace with small task  1]
- [ ] [Replace with small task  2]
- [ ] [Replace with small task  3]

## Week 4
### [Task Name]:

#### Description
- [Replace with description]

#### ETA:
> How long do you think it will take to complete this?
- [Replace with eta]

#### Objective:
> Checklist of everything you need to do to complete this issue
- [ ] [Replace with small task  1]
- [ ] [Replace with small task  2]
- [ ] [Replace with small task  3]


---

<details><summary>Task Template</summary>
<br>

### [Task Name]:

#### Description
- [Replace with description]

#### ETA:
> How long do you think it will take to complete this?
- [Replace with eta]

#### Objective:
> Checklist of everything you need to do to complete this issue
- [ ] [Replace with small task  1]
- [ ] [Replace with small task  2]
- [ ] [Replace with small task  3]

<br><br>
</details>