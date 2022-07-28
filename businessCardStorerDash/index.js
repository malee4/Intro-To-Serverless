let selectCard = document.getElementById("selectCard");

// get the most recent values
function refresh() {
    // get the JSON of names only
    const endpoint = "https://melodybitproj.azurewebsites.net/api/retrieveCardsFromCosmos?code=nAgyFZJbId1UKolKbNV7UC7NlvYmT3BUxNmC3Yx40aBrAzFuB6srBQ==?reqType=nameList"
    const resp = await fetch(endpoint, {
        "method":"GET"
    });
    const data = await resp.json();
    const cardNameList = Object.keys(data); // retrieve from retrieveCardsFromCosmos
    console.log(cardNameList)

    // add the values
    for (let i = 0; i < cardNameList.length; i++) {
        var opt = cardNameList[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        selectCard.appendChild(el);
    }
};

// display the card selected
let findCard = document.getElementById("findCard");

findCard.addEventListener('submit', async function (event) {
    event.preventDefault();
    let contactName = document.getElementById("contactName");
    let companyName = document.getElementById("companyName");
    let address = document.getElementById("address");
    let email = document.getElementById("email");
    let website = document.getElementById("website");
    let fax = document.getElementById("fax");

    
});


let googleSearch = document.getElementById("googleSearch");

let selectLanguage = document.getElementById("selectLanguage");

let translate = document.getElementById("Translate");