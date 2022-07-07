const bunnForm = document.getElementById('bunnForm');

// every time someone submits the form, get value
bunnForm.addEventListener('submit', async function (event) {
    event.preventDefault()
    const username = document.getElementById("username").value
    const output = document.getElementById("output")
    if (username == "") {
        alert("No name error.")
        return;
    }

    // get the file input element
    let fileInput = document.getElementById("image");
    // get the file
    const file = fileInput.files[0];
    var payload = new FormData(bunnForm);
    payload.append("file", file)

    console.log(payload);


    // can contain information, will eventually be sent to endpoint
    var payload = new FormData(bunnForm);
    const endpoint = "https://melodybitproj.azurewebsites.net/api/bunnimage-upload?code=G0ZBcuVH4YW1EOIEGzSwGa03adJtU7upK-xIZ7tsLu86AzFu1YzdwQ==";
    const options = {
        "method":"POST",
        "body": payload,
        headers: {
            "codename": username,
            "Content-Type": "multipart/form-data"
        }
    }
    const resp = await fetch(endpoint, options);
    const data = await resp.text();
    output.textContent = "Your image has been stored successfully!"
});