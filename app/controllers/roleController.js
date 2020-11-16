import jwt from "jsonwebtoken";
import con from '../db';

export const newUserRole = (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            console.log("Invalid token, rerouting to login");
            res.sendStatus(403);
        } else {
            const userId = req.body.user_id;
            const catId = req.body.cat_id;
            const queryString = "INSERT INTO user_to_role(user_id, role_id) VALUES(?, ?);";
            con.query(queryString, [userId, catId], (err, rows) => {
                if (err) throw err;
                res.sendStatus(200);
            })
        }
    });
};

export const searchRole = (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            console.log("Invalid token, rerouting to login");
            res.sendStatus(403);
        } else {
            const searchString = req.body.search_string;
            const queryString = "SELECT * FROM role WHERE name LIKE '%" + searchString + "%';";
            con.query(queryString, [], (err, rows) => {
                if (err) throw err;
                res.json(rows);
            })
        }
    });
};