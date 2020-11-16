import bcrypt from "bcrypt";
import con from "../db";
import jwt from "jsonwebtoken";

const majors = ["Cinema and Photography", "Film, Photography and Visual Arts", "Documentary Studies", "Writing for Screen Media", "Acting"];
const years = ["Freshman", "Sophomore", "Junior", "Senior"];
const firstNames = ["Isa", "Fatimah", "Stephaine", "Suzanne", "Min", "Mamie", "Delana", "Chante", "Jenette", "Dana", "Woodrow", "Lien", "Herta", "Newton", "Filomena", "Isidro", "Teddy", "Reuben", "Bambi", "Vertie"];
const lastNames = ["Robinson", "Sadler", "Ali", "Spangler", "Lusk", "Sanders", "Fritz", "Parr", "Cisneros", "Blackwell", "Comer", "Armstrong", "Brennan", "Caron", "Thomson", "Boone", "Blankenship", "Stevens", "Boyer", "Mason"];

const createUser = () => {
    const majorNdx = Math.floor(Math.random() * Math.floor(4));
    const yearNdx = Math.floor(Math.random() * Math.floor(3));
    const firstNameNdx = Math.floor(Math.random() * Math.floor(19));
    const lastNameNdx = Math.floor(Math.random() * Math.floor(19));

    const email = firstNames[firstNameNdx].charAt(0).toLowerCase() + lastNames[lastNameNdx].toLowerCase() + "@ithaca.edu";
    const password = "password";

    let insertString = 'INSERT INTO users(email, user_password, major, year, first_name, last_name, projects) VALUES (?, ?, ?, ?, ?, ?, 0);';
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;
        con.query(insertString, [email, hash, majors[majorNdx], years[yearNdx], firstNames[firstNameNdx], lastNames[lastNameNdx]], (err, rows, fields) => {
            if (err) throw err;
            jwt.sign({email: email, password: password}, 'secretkey', (err, token) => {
                if (err) throw err;
                console.log(email, " ", password, " ", token);
            });
        })
    });
};

export default createUser;