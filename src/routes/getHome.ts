import path from "path";
import { Application } from "express-ws";
import { findUserById } from "../repositories/userRepository";

export function getHome(app: Application) {
    app.get("/home", async (req, res) => {
        const user = await findUserById(req.signedCookies.ssid);
        if (!user) {
            res.clearCookie("ssid");
            res.redirect("/login");
            return;
        }

        res.sendFile(path.join(__dirname, '../../public/home/home.html'));
        //res.sendFile(path.join(process.cwd(), "../../pulic/chat/chat.html"));
    });
}