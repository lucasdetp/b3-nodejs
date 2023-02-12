import { Application } from "express-ws";
import { WebSocket } from "ws";
import fs from "fs";
import path from "path";

import { findUserById, createPost, createPostImage, findPosts } from "../repositories/userRepository";


export function getPosts(app: Application, sockets: Map<string, WebSocket>) {
    app.ws("/posts", async (ws, req) => {
        const user = await findUserById(req.signedCookies.ssid);
        if (!user) {
            ws.close();
            return;
        }

        sockets.set(user.id, ws);
        const psts = await findPosts();
        ws.send(JSON.stringify({ type: "load", data: { psts } }));

        ws.on("message", async (msg: string) => {
            if (msg.includes("base64")) {
                const name = Date.now().toString() + ".png";
                const b = Buffer.from(msg.split(",")[1], "base64");
                const file = path.join(__dirname, `../../public/images/${name}`);
                const wstream = fs.createWriteStream(file);

                wstream.write(b);

                await createPostImage(name, user.id);

                sockets.forEach((socket) => {
                    if (socket !== ws)
                        socket.send(JSON.stringify({ type: "image", data: { msg, user } }));
                });
            } else {
                await createPost(msg, user.id);
                sockets.forEach((socket) => {
                    if (socket !== ws)
                        socket.send(JSON.stringify({ type: "post", data: { msg, user } }));
                });
            }
        });


        ws.on("close", () => {
            sockets.delete(user.id);
        });
    });
}