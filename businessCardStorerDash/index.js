const { Context } = require("mocha");

let selectCard = document.getElementById("selectCard");

// get the most recent values and return something if findCard card is selected
function findCard() {
    

    // setup
    let contactName = document.getElementById("contactName");
    let companyName = document.getElementById("companyName");
    let address = document.getElementById("address");
    let email = document.getElementById("email");
    let website = document.getElementById("website");
    let fax = document.getElementById("fax");

    // get the JSON of names only
    const endpoint = "https://melodybitproj.azurewebsites.net/api/retrieveCardsFromCosmos"
    // const listResp = await fetch(endpoint, {
    //     "method":"GET", 
    //      "headers":{
            //  'reqType': 'nameList'
    //      }
    // });

    // const listData = await listResp.json();
    // let cardNameList = Object.keys(listData); // retrieve from retrieveCardsFromCosmos

    let cardNameList = ["Yingguang Li, NUAA", "Cao Yanlong, undefined", "Xiaozhong Hao, NUAA", "Lihui Wang, KTH"]
    let myCardName = selectCard.value;

    if (myCardName != "Choose a card") {
        let index = data[myCardName]; // should be an integer?
        console.log(index)

        // retrieve info from CosmosDB
        "reqType=cardImage&inputName="
        const getCardResp = await fetch(endpoint, {
            "method":"GET", 
            headers: {
                'reqType': 'cardImage',
                'cosmosIndex': index
            }
        });

        const getCardData = getCardResp.json();
        console.log(getCardData);
        
        // display info
    } else {
        for (let i = 0; i < cardNameList.length; i++) {
            var opt = cardNameList[i];
            var el = document.createElement("option");
            el.textContent = opt;
            el.value = opt;
            selectCard.appendChild(el);
        }
    }
};


let googleSearch = document.getElementById("googleSearch");

let selectLanguage = document.getElementById("selectLanguage");

let translate = document.getElementById("Translate");