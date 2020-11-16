import jwt from "jsonwebtoken";
import con from "../db";
import { connectNameSpace } from '../utils/socket';
import { logMessage } from "../utils/dbMessages";

export const getMessages = (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            console.log(err, "Invalid token, rerouting to login");
            res.sendStatus(403);
        } else {
            const nameSpace = req.body.name_space;
            const room = req.body.room;
            connectNameSpace(nameSpace, room);
            const queryString = "SELECT * FROM messages WHERE name_space = ? AND room = ?;";
            con.query(queryString, [nameSpace, room], (err, rows, fields) => {
                if (rows.length === 0) {
                    const message = {
                        id: "0",
                        user_name: "Admin",
                        text: `Welcome to ${room}!`,
                    };
                    logMessage(message, nameSpace, room).then(() => {
                        const arr = [];
                        arr.push(message);
                       res.send(arr);
                    });
                } else {
                    const length = rows.length;
                    if (length > 50) {
                        const sliced = rows.slice(length - 50, length);
                        res.json(sliced);
                    } else {
                        res.json(rows);
                    }
                }
            })
        }
    })
};