const messageList = document.getElementById('message-list');
const chatStatus = document.getElementById('chat-status');
let isStartedGame = false;
let correctWord = null;
let findWord = null;

function addMessage(name, message) {
  if (message === '/endGame') {
    return;
  }
  const messageElement = document
    .createElement('div');
  const nameElement = document
    .createElement('b');
  nameElement.innerText = name;
  messageElement.appendChild(nameElement);
  const textElement = document
    .createElement('span');
  textElement.innerText = message;
  messageElement.appendChild(textElement);
  messageList.appendChild(messageElement);
}

let ws

function connect() {
  ws = new WebSocket('ws://localhost:3000/ws');

  // wsGame = new WebSocket("ws://localhost:3000/game");

  // wsGame.onmessage = (event) => {
  //   const { type, data } = JSON.parse(event.data);
  //   if (type === "startGame") {
  //     addMessage(data.msg);
  //   }
  // };

  ws.onopen = () => {
    console.log('Connected');
    chatStatus.style.backgroundColor = 'green';
  };

  ws.onclose = () => {
    console.log('Disconnected');
    chatStatus.style.backgroundColor = 'red';
    setTimeout(connect, 1000);
  };

  ws.onerror = (error) => {
    console.log('Error', error);
  };

  ws.onmessage = (event) => {
    console.log('Message from server', event.data);
    const { type, data } = JSON.parse(event.data);
    if (type === 'startGame' && !isStartedGame) {
      findWord = data.word;
      isStartedGame = true;
      correctWord = data.correctWord;
      addMessage('Bot : ', 'Début de la partie le mot à trouver : ' + findWord);
    }
    if (type === 'endGame' && isStartedGame) {
      findWord = null;
      isStartedGame = false;
      correctWord = null;
      addMessage('Bot : ', 'Fin de la partie, pour rejouer taper /game');
    }
    if (data.msg === correctWord && isStartedGame) {
      addMessage('Bot : ', data.user.name + ' as trouvé le mot ! La réponse était : ' + correctWord);
      ws.send('/endGame');
    } else if (isStartedGame) {
      addMessage('Bot : ', data.user.name + " a entré le mot " + data.msg + " essaye encore ce n'est pas le bon !");
    }
    if (type === 'reply' && !isStartedGame) {
      addMessage(
        data.user.name + ' : ',
        data.msg
      );

    }


  };
}

connect()

document.querySelector('form')
  .addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document
      .querySelector('#chat-input');
    ws.send(input.value);
    input.value = '';
  });
