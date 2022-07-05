const bunnForm = document.getElementById('bunnForm');

// every time someone submits the form, get value
bunnForm.addEventListener('submit', function (event) {
    event.preventDefault()
    const username = document.getElementById("username").value
    const output = document.getElementById("output")
    output.textContent = username + "❤"
});