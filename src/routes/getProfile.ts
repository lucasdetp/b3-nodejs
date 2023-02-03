import { Application } from "express-ws";
import path from "path";

export function getProfile(app: Application) {
    app.get('/profile', (req, res) => {
        if (req.signedCookies.ssid) {
            res.sendFile(path.join(__dirname, '../../pages/profile.html'))
            return
        }

        res.redirect('/')
    })
}
