import { Application } from "express-ws";
import bodyParser from "body-parser";
import { deleteUser } from "../repositories/deleteUser";

export function postDelete(app: Application) {
    app.post('/delete', bodyParser.urlencoded(),
        async (req, res) => {
            const id = req.signedCookies.ssid;

            if (!id) {
                res.status(400).send('Bad Request')
                return
            }

            await deleteUser(id)
            res.redirect('/login');

        })
}