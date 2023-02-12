const postsList = document.getElementById("list");

const sendFile = (myFile, ws) => {
    const reader = new FileReader();

    reader.readAsDataURL(myFile);

    reader.onload = () => {
        const dataUrl = reader.result;
        ws.send(dataUrl);
        addImage(dataUrl);
    };
};

let ws;
function connect() {
    ws = new WebSocket("ws://localhost:3000/posts");

    ws.onmessage = (event) => {
        const { type, data } = JSON.parse(event.data);
        if (type === "post") {
            addMessage(data.msg);
        }
        if (type === "image") {
            addImage(data.msg, data.name);
        }
        if (type === "load") {

            data.psts.forEach(element => {
                if (element.image) {
                    addImage(element.image, element.createdAt);

                } else {
                    addMessage(element.content, element.createdAt);
                }
            });
        }
    };
}

connect();

function addImage(data, createdAt) {
    const li = document.createElement("li");
    const date = createdAt ? new Date(createdAt).toLocaleString() : new Date().toLocaleString();
    const image = document.createElement("img");
    image.src = `http://localhost:3000/images/${data}`;
    image.onerror = function () {
        image.src = data;
    }
    li.appendChild(image);
    li.insertAdjacentHTML("afterbegin", `${date}`);
    postsList.prepend(li);
}


function addMessage(content, createdAt) {
    const message = document.createElement("li");
    const date = createdAt ? new Date(createdAt).toLocaleString() : new Date().toLocaleString();
    createdAt = date;
    message.innerText = date + " : " + content;
    postsList.prepend(message);
}



document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const inputText = document.querySelector("#post-area");
    const inputFile = document.getElementById("my-files");
    const file = inputFile.files[0];
    const postValue = inputText.value.trim();
    if (postValue !== "") {
        ws.send(postValue);
        addMessage(postValue);
        inputText.value = "";
    }
    if (file) {
        sendFile(file, ws);
        inputFile.value = "";
    }
});