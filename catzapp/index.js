const button = document.getElementById("button1");

button.addEventListener("click", function() {

    const name1 = document.getElementById("name1").value;
    const name2 = document.getElementById("name2").value;
    const name3 = document.getElementById("name3").value;
    const name4 = document.getElementById("name4").value;

    const AZURE_URL = "https://melodybitproj.azurewebsites.net/api/twocatz?code=LP_JM3YNIvJV7_xwY3FuMnK7ogUP6aCOFV_ZfCLv2J7FAzFuh8IU9A==";


    const fetch_url = `${AZURE_URL}&name1=${name1}&name2=${name2}&name3=${name3}&name4=${name4}`

    document.getElementById("image").src = "https://cataas.com/cat/says/" + cat;
    
    
    
});