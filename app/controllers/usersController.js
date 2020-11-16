import jwt from 'jsonwebtoken';
import con from '../db';

// const cloudinary = require('cloudinary').v2;

export const getUsers = (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            console.log("Invalid token, rerouting to login");
            res.sendStatus(403);
        } else {
            con.query("SELECT id, avatar, first_name, last_name, major, year, projects FROM users;", (err, rows, fields) => {
                res.json(rows);
            })
        }
    })
};

export const searchUsers = (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            console.log("Invalid token, rerouting to login");
            res.sendStatus(403);
        } else {
            const query = req.body.query;
            console.log(query);
            const queryString = "SELECT id, avatar, first_name, last_name, major, year, projects FROM users WHERE CONCAT(first_name,  ' ', last_name) like '%" + query + "%'";
            con.query(queryString, [], (err, rows, fields) => {
                res.json(rows);
            })
        }
    })
};

export const getUserResume = (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            console.log("Invalid token, rerouting to login");
            res.sendStatus(403);
        } else {
            const fetchUser = async () => {
                let userInfo;
                const getUser = new Promise((resolve, reject) => {
                    con.query("SELECT * FROM users WHERE id = ?;", [req.body.user_id], (err, rows, fields) => {
                        if (err) reject(err);
                        if (rows[0]) {
                            let user = {
                                id: rows[0].id,
                                firstName: rows[0].first_name,
                                lastName: rows[0].last_name,
                                avatar: rows[0].avatar,
                                major: rows[0].major,
                                year: rows[0].year,
                                projects: rows[0].projects,
                                resumeOverview: rows[0].resume_overview
                            };
                            resolve(user);
                        } else {
                            reject("no user");
                        }
                    });
                });

                userInfo = await getUser;

                const getRoles = new Promise((resolve, reject) => {
                    const queryString = "SELECT role.id, role.name from user_to_role JOIN role  on user_to_role.role_id = role.id WHERE user_to_role.user_id = ?;"
                    con.query(queryString, [userInfo.id], (err, rows) => {
                        if (err) reject(err);
                        resolve(rows);
                    });
                });

                userInfo['roles'] = await getRoles;

                const getProjects = new Promise((resolve, reject) => {
                    const queryString = "SELECT project_to_role.id AS 'id', projects.id AS 'project_id', projects.name, projects.category, project_to_role.role_id, role.name AS 'role_name' from projects\n" +
                        "JOIN project_to_role on projects.id = project_to_role.project_id\n" +
                        "JOIN role  on project_to_role.role_id = role.id\n" +
                        "WHERE projects.user_id = 1;";
                    con.query(queryString, [userInfo.id], (err, rows) => {
                        if (err) reject(err);
                        resolve(rows);
                    })
                });

                userInfo['projects'] = await getProjects;

                const getReels = new Promise((resolve, reject) => {
                    const queryString = "SELECT * FROM video Where user_id = ?";
                    con.query(queryString, [userInfo.id], (err, rows) => {
                        if (err) reject(err);
                        resolve(rows);
                    })
                });

                userInfo['reels'] = await getReels;

                return userInfo;
            };
            fetchUser().then(data => {
                res.json(data);
            })
        }
    });
};

export const getCurrentUser = (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            console.log("Invalid token, rerouting to login");
            res.sendStatus(403);
        } else {
            const fetchUser = async () => {
                let userInfo;
                const getUser = new Promise((resolve, reject) => {
                    con.query("SELECT * FROM users WHERE email = ?;", [authData.user.email], (err, rows, fields) => {
                        if (err) reject(err);
                        let user = {
                            id: rows[0].id,
                            firstName: rows[0].first_name,
                            lastName: rows[0].last_name,
                            avatar: rows[0].avatar,
                            major: rows[0].major,
                            year: rows[0].year,
                            projects: rows[0].projects,
                            resumeOverview: rows[0].resume_overview
                        };
                        resolve(user);
                    });
                });

                userInfo = await getUser;

                const getRoles = new Promise((resolve, reject) => {
                    const queryString = "SELECT role.id, role.name from user_to_role JOIN role  on user_to_role.role_id = role.id WHERE user_to_role.user_id = ?;"
                    con.query(queryString, [userInfo.id], (err, rows) => {
                        if (err) reject(err);
                        resolve(rows);
                    });
                });

                userInfo['roles'] = await getRoles;

                const getProjects = new Promise((resolve, reject) => {
                    const queryString = "SELECT project_to_role.id AS 'id', projects.id AS 'project_id', projects.name, projects.category, project_to_role.role_id, role.name AS 'role_name' from projects\n" +
                    "JOIN project_to_role on projects.id = project_to_role.project_id\n" +
                    "JOIN role  on project_to_role.role_id = role.id\n" +
                    "WHERE projects.user_id = 1;";
                    con.query(queryString, [userInfo.id], (err, rows) => {
                        if (err) reject(err);
                        resolve(rows);
                    })
                });

                userInfo['projects'] = await getProjects;

                const getReels = new Promise((resolve, reject) => {
                    const queryString = "SELECT * FROM video Where user_id = ?";
                    con.query(queryString, [userInfo.id], (err, rows) => {
                        if (err) reject(err);
                        resolve(rows);
                    })
                });

                userInfo['reels'] = await getReels;

                return userInfo;
            };
            fetchUser().then(data => {
                res.json(data);
            })
        }
    })
};

export const updateUser = (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            console.log("Invalid token, rerouting to login");
            res.sendStatus(403);
        } else {
            const id = req.body.data.id;
            const firstName = req.body.data.firstName;
            const lastName = req.body.data.lastName;
            const avatar = req.body.data.avatar;
            const year = req.body.data.year;
            const major = req.body.data.major;
            const projects = req.body.data.projects.length;
            const resumeOverview = req.body.data.resumeOverview;
            const queryString = "UPDATE users SET first_name = ?, last_name = ?, avatar = ?, year = ?, major = ?, projects = ?, resume_overview = ? WHERE id = ?";
            con.query(queryString, [firstName, lastName, avatar, year, major, projects, resumeOverview, id], (err, rows, fields) => {
                if (err) throw err;
                res.sendStatus(200);
            })
        }
    })
};

export const uploadImage = (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            console.log("Invalid token, rerouting to login");
            res.sendStatus(403);
        } else {
            console.log(req.body);
            res.sendStatus(200);
            // const imageData = req.body.image;
            // const image = new Image();
            // image.src = imageData;
            //
            // cloudinary.uploader.upload(image,
            //     (error, result) => {
            //         if (error) throw error;
            //         res.send(result);
            //     });
        }
    });

    // cloudinary.uploader.upload("dog.mp4",
    //     { resource_type: "video",
    //         public_id: "my_folder/my_sub_folder/dog_closeup",
    //         chunk_size: 6000000,
    //         eager: [
    //             { width: 300, height: 300, crop: "pad", audio_codec: "none" },
    //             { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" } ],
    //         eager_async: true,
    //         eager_notification_url: "https://mysite.example.com/notify_endpoint" },
    //     function(error, result) {console.log(result, error)});

};