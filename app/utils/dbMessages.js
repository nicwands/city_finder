import con from '../db';

export const logMessage = async (message, nameSpace, room) => {
    console.log(message);
    const insert = new Promise((resolve, reject) => {
        const insertString = "INSERT INTO messages(user_id, user_name, name_space, room, text) VALUES (?, ?, ?, ?, ?);";
        con.query(insertString, [message.id, message.user_name, nameSpace, room, message.text], (err, rows, fields) => {
            if (err) {
                throw err;
            } else {
                resolve("message logged");
            }
        })
    }).catch(err => {
        throw err
    });

    return await insert
};