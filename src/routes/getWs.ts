import { Application } from "express-ws";
import { WebSocket } from "ws";
import { findUserById } from "../repositories/userRepository";
const words = ['bonjour', 'chat', 'chien', 'technologie', 'ordinateur', 'automobile', 'maison', 'fenêtre', 'bibliothèque', 'livre', 'node', 'module', 'My Digital School'];
let word: string | null | undefined = null;
let correctWord: string | null | undefined = null;



const shuffle = function shuffle(s: string[], len: number) {
  const shuf = s;
  let i = 0;
  let j = 0;
  let tmp = '';
  while (i < len) {
    j = Math.floor(Math.random() * len);
    tmp = shuf[j];
    shuf[j] = shuf[i];
    shuf[i] = tmp;
    i++;
  }
  return (shuf);
}


export function getWs(app: Application, sockets: Map<string, WebSocket>) {
  app.ws('/ws', async (ws, req) => {
    if (!req.signedCookies.ssid) {
      ws.close();
      return
    }
    const user = await findUserById(req.signedCookies.ssid);
    if (!user) {
      ws.close();
      return
    }
    sockets.set(user.id, ws);
    ws.on('message', (msg) => {
      sockets.forEach((socket) => {
        if (msg.toString() === "/game") {
          if (!word && !correctWord) {
            const randomIndex = Math.floor(Math.random() * words.length);
            word = words[randomIndex];
            correctWord = word;

            word = shuffle(word.split(''), word.length).join('');
          }

          socket.send(JSON.stringify({
            type: 'startGame',
            data: { msg, word, correctWord }
          }));
        } else if (msg.toString() === "/endGame") {
          word = '';
          correctWord = '';
          socket.send(JSON.stringify({
            type: 'endGame',
            data: { msg }
          }));
        } else {
          socket.send(JSON.stringify({
            type: 'reply',
            data: { msg, user }
          }));
        }
      })
    })
    ws.on('close', () => {
      sockets.delete(user.id);
    })
  });
}
