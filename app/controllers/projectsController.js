import jwt from 'jsonwebtoken';
import con from '../db';

export const getProjects = (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            console.log("Invalid token");
            res.sendStatus(403);
        } else {
            con.query("SELECT * FROM projects;", (err, rows, fields) => {
                res.json(rows);
            })
        }
    })
};

export const newProject = (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            console.log("Invalid token");
            res.sendStatus(403);
        } else {
            const name = req.body.name;
            const description = req.body.description;
            const category = req.body.category;
            const creatorId = req.body.creator_id;
            const members = req.body.members;
            const due = req.body.due;
            let insertString = 'INSERT INTO projects(name, description, category, creator_id, members, due) VALUES (?, ?, ?, ?, ?, ?);';
            con.query(insertString, [name, description, category, creatorId, members, due], (err, rows, fields) => {
                if (err) throw err;
                res.sendStatus(200);
            })
        }
    })
};

export const getBudget = (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            console.log("Invalid token");
            res.sendStatus(403);
        } else {
            const projectBudget = {};

            const projectId = req.body.project_id;
            const queryString =
                "select budget_item.item, budget_item.description, budget_item.cost " +
                "from budget_item " +
                "inner join budget_subcat on budget_item.subcat_id = budget_subcat.id " +
                "inner join budget_cat on budget_subcat.category_id = budget_cat.id " +
                "where project_id = ? and budget_cat.id = 3;";
            con.query(queryString, [projectId], (err, rows) => {
                if (err) throw err;
                console.log(rows);
                projectBudget.aboveLine = rows;
                console.log(projectBudget);
                res.json(projectBudget);
            });
        }
    })
};

export const newBudgetItem = (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            console.log("Invalid token");
            res.sendStatus(403);
        } else {
            const projectId = req.body.project_id;
            const category = req.body.category;
            const subCategory = req.body.sub_category;
            const item = req.body.item;
            const description = req.body.description;
            const cost = req.body.cost;
            const queryString = "INSERT INTO budget_item(project_id, category, sub_category, item, description, cost) VALUES (?, ?, ?, ?, ?, ?);";
            con.query(queryString, [projectId, category, subCategory, item, description, cost], (err, rows) => {
                if (err) throw err;
                res.sendStatus(200);
            })
        }
    })
};