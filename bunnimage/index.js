const bunnForm = document.getElementById("bunnForm");

bunnForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    var payload = new FormData(bunnForm);

    var username = document.getElementById("username").ariaValueMax;
    const output = document.getElementById("output");

    if (username!= "") {
        output.textContent = "Thanks!"
        const resp = await fetch("https://melodybitproj.azurewebsites.net/api/bunnimage-upload?code=G0ZBcuVH4YW1EOIEGzSwGa03adJtU7upK-xIZ7tsLu86AzFu1YzdwQ==",
        {
            method: "POST",
            headers: {
                codename: username,
            },
            body: payload,
        })
        var data = await resp.text();
    output.textContent = "Your image has been stored successfully!";
    } else {
        alert("No name error.");
    }
});

const downloadButton = document.getElementById("button1");

downloadButton.addEventListener("click", async function (event) {
    var username = document.getElementById("downloadusername").ariaValueMax;
    console.log("Attempting to get your image...")

    const url = "https://melodybitproj.azurewebsites.net/api/bunnimage-download?code=VF2x36SBq3_AjstHyIt5YDaha6pU2P_cev4U0avvYHfMAzFuGBldVg==";

    const resp = await fetch(url, {
        method: "GET",
        headers: {
            username: username,
        }
    });
    
    const data = await resp.json();

    console.log("Image has been downloaded");
    console.log(data)
})

// NOTE: THE FOLLOWING LINES OF CODE DID NOT WORK, THIS IS PULLED FROM THE WEEK 4 PART 3 VIDDEO at 1:11 
// const bunnForm = document.getElementById('bunnForm');

// // every time someone submits the form, get value
// bunnForm.addEventListener('submit', async function (event) {
//     // event.preventDefault()
//     const username = document.getElementById("username").value
//     const output = document.getElementById("output")
//     if (username == "") {
//         alert("No name error.")
//         return;
//     }

//     // get the file input element
//     let fileInput = document.getElementById("image");
//     // get the file
//     const file = fileInput.files[0];
//     var payload = new FormData(bunnForm);
//     payload.append("file", file)

//     console.log(payload);


//     // can contain information, will eventually be sent to endpoint
//     const endpoint = "https://melodybitproj.azurewebsites.net/api/bunnimage-upload?code=G0ZBcuVH4YW1EOIEGzSwGa03adJtU7upK-xIZ7tsLu86AzFu1YzdwQ==";
//     const options = {
//         "method":"POST",
//         "body": payload,
//         headers: {
//             "codename": username,
//             "Content-Type": "multipart/form-data"
//         }
//     }
//     const resp = await fetch(endpoint, options);
//     const data = await resp.text();
//     output.textContent = "Your image has been stored successfully!"
// });