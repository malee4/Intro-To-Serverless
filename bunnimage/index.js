// const bunnForm = document.getElementById("bunnForm");

// bunnForm.addEventListener("submit", async function (event) {
//     event.preventDefault();
//     var payload = new FormData(bunnForm);
//     console.log(payload)
//     var username = document.getElementById("username").value;
//     const output = document.getElementById("output");

//     if (username!= "") {
//         output.textContent = "Thanks!"
//         const resp = await fetch("https://melodybitproj.azurewebsites.net/api/bunnimage-upload?code=G0ZBcuVH4YW1EOIEGzSwGa03adJtU7upK-xIZ7tsLu86AzFu1YzdwQ==",
//         {
//             method: "POST",
//             headers: {
//                 codename: username,
//             },
//             body: payload,
//         })
//     var data = await resp.text();
//     console.log(data)
//     output.textContent = "Your image has been stored successfully!";
//     } else {
//         alert("No name error.");
//     }
// });

const downloadButton = document.getElementById("button2");

downloadButton.addEventListener("click", async function (event) {
    var username = document.getElementById("downloadusername").value;
    console.log("Attempting to get your image...");

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

    window.open(data.downloadUri, "_self");
})

// NOTE: THE FOLLOWING LINES OF CODE DO NOT UPLOAD FILES, THIS IS PULLED FROM THE WEEK 4 PART 3 VIDDEO at 1:11 
const bunnForm = document.getElementById('bunnForm');

// every time someone submits the form, get value
bunnForm.addEventListener('submit', async function (event) {
    event.preventDefault()
    const username = document.getElementById("username").value;
    console.log("Getting username:");
    console.log(username);

    console.log("Getting output...");
    const output = document.getElementById("output")

    if (username == "") {
        alert("No name error.")
        return;
    }

    // get the file input element
    let fileInput = document.getElementById("image");
    console.log(fileInput)
    // get the file
    const file = fileInput.files[0];
    var payload = new FormData(bunnForm);

    payload.append("file", file);
    console.log("Appending file to payload");
    

    // can contain information, will eventually be sent to endpoint
    const endpoint = "https://melodybitproj.azurewebsites.net/api/bunnimage-upload?code=G0ZBcuVH4YW1EOIEGzSwGa03adJtU7upK-xIZ7tsLu86AzFu1YzdwQ==";
    const options = {
        "method":"POST",
        "body": payload,
        headers: {
            "codename": username,
            "Content-Type": "multipart/form-data"
        }
    }

    console.log("Fetching and uploading");
    const resp = await fetch(endpoint, options);
    const data = await resp.text();
    console.log(data);
    output.textContent = "Your image has been stored successfully!"
});