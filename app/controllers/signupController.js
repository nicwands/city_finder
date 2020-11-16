import con from '../db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { decodeClientAuth, validateLogin } from '../utils/authUtil';

const saltRounds = 10;

export const getSignup = (req, res) => {
    const clientAuth = decodeClientAuth(req);
    if (clientAuth === '403' || clientAuth === 'bad email') {
        res.sendStatus(403);
    } else if (clientAuth === 'not ithaca') {
        res.send("Please use an ithaca.edu email address");
    } else {
        const queryString = 'SELECT * FROM users WHERE (email) = (?);';
        con.query(queryString, [clientAuth.email],function (err, rows, fields) {
            if (err) throw err;
            if (Object.keys(rows).length !== 1) {
                console.log(req.body);
                const major = req.body.major;
                const year = req.body.year;
                const first_name = req.body.first_name;
                const last_name = req.body.last_name
                let insertString = 'INSERT INTO users(email, user_password, major, year, first_name, last_name, projects) VALUES (?, ?, ?, ?, ?, ?, 0);';
                bcrypt.hash(clientAuth.password, saltRounds, (err, hash) => {
                    if (err) throw err;
                    con.query(insertString, [clientAuth.email, hash, major, year, first_name, last_name], (err, rows, fields) => {
                        if (err) throw err;
                        jwt.sign({clientAuth}, 'secretkey', (err, token) => {
                            res.json({status: 200, token: token});
                        });
                    })
                });
            } else {
                validateLogin(clientAuth, rows[0].user_password).then(returned => {
                    if (returned !== '401') {
                        res.json({token: returned})
                    } else {
                        res.sendStatus(401)
                    }
                })
            }
        });
    }
};