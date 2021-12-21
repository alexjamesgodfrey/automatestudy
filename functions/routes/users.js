/**
 * MAIN ROUTES
 */
const pool = require("../db.js");
 
const log4js = require("log4js");
log4js.configure({
    appenders: {
      everything: { type: 'file', filename: 'log.log' }
    },
    categories: {
      default: { appenders: [ 'everything' ], level: 'trace' }
    }
});
var logger = log4js.getLogger();

module.exports = function (app) {
    //get all users
    app.get("/api/users", async (req, res) => {
        try {
            const req = await pool.query("SELECT * FROM users");
            res.json(req.rows);
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
                "INSERT INTO users (displayname, email, photourl, uid, flows) VALUES ($1, $2, $3, $4, $5)", 
                [displayname, email, photourl, uid, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]);
            logger.trace(`Successfully created user ${userid}`)
            res.json(`Successfully created user ${userid}`);
        } catch (err) {
            logger.error(`Failed to create user ${userid}`);
        }
    })
        
    //make a user's account public
    app.put("/api/users/makepublic/:uid", async (req, res) => {
        try {
            const { uid } = req.params;
            const changePublic = await pool.query("UPDATE users set public = true WHERE uid = $1", [uid]);
            logger.trace("Account made public for user " + uid)
            res.json("Account made public for user " + uid)
        } catch (err) {
            logger.error("Account could not be made public for user " + uid + "\n error message: " + err.message)
        }
    })

    //make a user's account private (not public)
    app.put("/api/users/makeprivate/:uid", async (req, res) => {
        try {
            const { uid } = req.params;
            const changePublic = await pool.query("UPDATE users set public = false WHERE uid = $1", [uid]);
            logger.trace("Account made public for user " + uid)
            res.json("Account made private for user " + uid)
        } catch (err) {
            logger.error("Account could not be made private for user " + uid + "\n error message: " + err.message)
        }
    })

    //update a user's photourl
    app.put("/api/users/photourl/:uid", async (req, res) => {
        try {
            const { url } = req.body;
            const { uid } = req.params;
            const changePublic = await pool.query("UPDATE users set photourl = $1 WHERE uid = $2", [url, uid]);
            logger.trace(`Changed photourl to ${url} for ${uid}`)
            res.json(`Changed photourl to ${url} for ${uid}`)
        } catch (err) {
            logger.error("Photourl could not be changed for user " + uid + "\n error message: " + err.message)
        }
    })

    //update a user's displayname
    app.put("/api/users/displayname/:uid", async (req, res) => {
        try {
            const { displayname } = req.body;
            const { uid } = req.params;
            const changePublic = await pool.query("UPDATE users set displayname = $1 WHERE uid = $2", [displayname, uid]);
            logger.trace(`Changed displayname to ${displayname} for ${uid}`)
            res.json(`Changed displayname to ${displayname} for ${uid}`)
        } catch (err) {
            logger.error("displayname could not be changed for user " + displayname + "\n error message: " + err.message)
        }
    })
}