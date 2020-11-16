import jwt from 'jsonwebtoken';
import con from '../db';

export const getTasks = (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            console.log("Invalid token");
            res.sendStatus(403);
        } else {
            const project = req.body.project_id;
            con.query("SELECT * FROM tasks WHERE project_id = ?;", [project], (err, rows, fields) => {
                res.json(rows);
            })
        }
    })
};
