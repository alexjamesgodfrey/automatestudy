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
            res.json(user.rows[0]);
        } catch (err) {
            console.error(err.message);
        }
    })

    //get user based on id
    app.get("/api/userbyid/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
            res.json(user.rows[0]);
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
            logger.trace(`Successfully created user ${uid}`)
            res.json(`Successfully created user ${uid}`);
        } catch (err) {
            const { uid } = req.body
            logger.error(`Failed to create user ${uid}. \n ${err.message}`);
        }
    })

    //update a user's classes
    app.put("/api/users/classes/:uid", async (req, res) => {
        try {
            const { uid } = req.params;
            const { cs } = req.body
            const classes = '{' + cs.split() + '}'
            const changeClasses = await pool.query("UPDATE users set classes = $1 WHERE uid = $2", [classes, uid]);
            logger.trace(`Classes updated to ${classes} for user ${uid}`)
            res.json(`Classes updated to ${classes} for user ${uid}`)
        } catch (err) {
            const { uid } = req.params;
            logger.error(`Classes could not be updated for user ${uid}. \n ${err.message}`)
            console.error(err.message)
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
            const { uid } = req.params;
            logger.error(`Account could not be made public for user ${uid} \n error message: ${err.message}`)
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
            const { uid } = req.params;
            logger.error(`Account could not be made private for user ${uid} \n error message: ${err.message}`)
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
            const { uid } = req.params;
            logger.error(`Photourl could not be changed for user ${uid} \n error message: ${err.message}`)
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
            const { uid } = req.params;
            logger.error(`displayname could not be changed for user ${uid} \n error message: ${err.message}`)
        }
    })

    //update a user's stripecustomer
    app.put("/api/users/stripecustomer", async (req, res) => {
        try {
            const { stripecustomer, email } = req.body;
            await pool.query("UPDATE users set stripecustomer = $1 WHERE email = $2", [stripecustomer, email]);
            logger.trace(`Updated stripecustomer for ${email}`)
            res.json(`Updated stripecustomer for ${email}`)
        } catch (err) {
            const { stripecustomer, email } = req.body;
            logger.error(`Could not update stripcustomer for ${email}`)
        }
    })

    //update a user's stripecustomerid
    app.put("/api/users/stripecustomerid", async (req, res) => {
        try {
            const { stripecustomerid, email } = req.body;
            await pool.query("UPDATE users set stripecustomerid = $1 WHERE email = $2", [stripecustomerid, email]);
            logger.trace(`Updated stripecustomerid for ${email}`)
            res.json(`Updated stripecustomerid for ${email}`)
        } catch (err) {
            const { stripecustomerid, email } = req.body;
            logger.error(`Could not update stripcustomer for ${email}`)
        }
    })

    //update a user's stripesubscription
    app.put("/api/users/stripesubscription", async (req, res) => {
        try {
            const { stripesubscription } = req.body;
            await pool.query("UPDATE users set stripesubscription = $1 WHERE stripecustomerid = $2", [stripesubscription, stripesubscription.customer]);
            logger.trace(`Updated stripecustomer for ${stripesubscription.customer}`)
            res.json(`Updated stripecustomer for ${stripesubscription.customer}`)
        } catch (err) {
            const { stripecustomer } = req.body;
            logger.error(`Could not update stripcustomer for ${stripesubscription.customer}`)
        }
    })
}