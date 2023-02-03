import bodyParser from "body-parser";
import { Application } from "express-ws";
import { updateUser } from "../repositories/updateUser";

export function postProfile(app: Application) {
    app.post('/profile', bodyParser.urlencoded(),
        async (req, res) => {
            const email = req.body.email;
            const name = req.body.name;
            const id = req.signedCookies.ssid;

            if (!email || !name) {
                res.status(400).send('Bad Request')
                return
            }

            const user = await updateUser(id, email, name)
            res.cookie('ssid', user.id, { signed: true, httpOnly: true, sameSite: true });
            res.redirect('/');
        })
}