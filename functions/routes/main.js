/**
 * MAIN ROUTES
 */
 const pool = require("../db.js");

 module.exports = function (app) {

    //get all users
    app.get("/api/users", async (req, res) => {
        try {
            const req = await pool.query("SELECT * FROM users");
            res.json(req);
        } catch (err) {
            console.error(err.message);
        }
    })

    //get user based on uid
    app.get("/api/users/:uid", async (req, res) => {
        try {
            const { uid } = req.params;
            const user = await pool.query("SELECT * FROM users WHERE uid = $1", [uid]);
            res.json(user.rows);
        } catch (err) {
            console.error(err.message);
        }
    })

    //get a user's survey response based on uid
    app.get("/api/survey/:uid", async (req, res) => {
        try {
            const { uid } = req.params;
            const here = await pool.query("SELECT * FROM studyflow WHERE uid = $1", [uid]);
            res.json(here.rows);
        } catch (err) {
            console.error(err.message);
        }
    })

    //create a new user
    app.post("/api/users", async (req, res) => {
        try {
            const { displayname, email, photourl, uid } = req.body;
            const insertUser = await pool.query(
                "INSERT INTO users (displayname, email, photourl, uid) VALUES ($1, $2, $3, $4)", 
                [displayname, email, photourl, uid]);
            res.json(insertUser.rows);
        } catch (err) {
            console.error(err.message);
        }
    })
}