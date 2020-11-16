import con from '../db';
import { decodeClientAuth, validateLogin } from '../utils/authUtil';

//TODO if user is not in database it throws error
export const getToken = (req, res) => {
    const clientAuth = decodeClientAuth(req);
    if (clientAuth === '403' || clientAuth === 'bad email' || clientAuth === 'not ithaca') {
        res.sendStatus(403);
    } else {
        const queryString = 'SELECT * FROM users WHERE (email) = (?);';
        con.query(queryString, [clientAuth.email],function (err, rows, fields) {
            if (err) throw err;
            if (Object.keys(rows).length !== 1) {
                res.sendStatus(403)
            }
            validateLogin(clientAuth, rows[0].user_password).then(returned => {
                if (returned !== '401') {
                    res.json({status: 200, token: returned})
                } else {
                    res.sendStatus(401)
                }
            });
        });
    }
};