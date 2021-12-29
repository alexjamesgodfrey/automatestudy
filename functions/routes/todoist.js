/**
 * TODOIST ROUTES
 */
require("dotenv").config();
const fetch = require('isomorphic-unfetch')
const pool = require("../db.js");

const log4js = require("log4js");
const Todoist = require("../methods/todoist.js");
log4js.configure({
    appenders: {
      everything: { type: 'file', filename: 'log.log' }
    },
    categories: {
      default: { appenders: [ 'everything' ], level: 'trace' }
    }
});
var logger = log4js.getLogger();

/**
 * requests an access code from todoists api then stores it in 
 * database. also calls initialize todoist at end of function
 * @param {String} code todoist grant code that is used to obtain access token
 * @param {String} uid the user's uid
 * @param {Integer} user_id the user's user_id
 * @param {String} classes_array a list of the user's classes (used to create project sections)
 */
const getAccessToken = async (code, uid, user_id, classes_array) => {
    const body = `{
        "client_id": "${process.env.TODOIST_CLIENT}",
        "client_secret": "${process.env.TODOIST_SECRET}",
        "code": "${code}"
    }`
    try {
        await fetch(`https://todoist.com/oauth/access_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, 
            body: body
        })
        .then(response => response.json())
        .then(async data => {
            logger.trace("Todoist access token received from Todoist for user " + uid)
            if (data.access_token) {
                Todoist.initializeTodoist(data.access_token, 'Studyflow: Semester N', user_id, classes_array)
                await fetch(`${process.env.BASE_REQUEST_URL}/api/todoist/store/${uid}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
            }
        })
    } catch (err) {
        logger.error("Todoist access token could not be fetched and added to database for user " + uid + "\nError message: " + err.message)
    }
    
}

module.exports = function (app) {
    //calls getAccessToken function
    app.put("/api/todoist/initialize/:code/:uid/:userid", async (req, res) => {
        try {
            const { code, uid, userid } = req.params;
             const { classes_array } = req.body;
            logger.trace("Todoist access token fetch requested for user " + uid)
            getAccessToken(code, uid, parseInt(userid), classes_array)
        } catch (err) {
            logger.error("Todoist access token fetch failed for user " + uid + "\n error message: " + err.message)
        }
    })

    //adds user's todoistaccess code information to user db
    app.post("/api/todoist/store/:uid", async (req, res) => {
        try {
            const { uid } = req.params;
            const { access_token } = req.body;
            const updateUsers = await pool.query("UPDATE users SET todoistaccess=$1 WHERE uid = $2", [access_token, uid]);
            logger.trace("Todoist access token successfully added to users database for user " + uid)
        } catch (err) {
            logger.error("Todoist access token could not be added to database for user " + uid + "\n error message: " + err.message)
        }
    })

    //get from todist based on userid
    app.get('/api/todoist/:userid', async (req, res) => {
        try {
            const { userid } = req.params;
            const getAll = await pool.query(
                "SELECT * FROM todoist WHERE userid=$1", [parseInt(userid)]
            )
            res.json(getAll.rows[0])
        } catch (err) {
            console.error(err.message)
        }
    })

    //adds the users todoist project info to db
    app.post("/api/todoist/project", async (req, res) => {
        try {
            const { userid, projectid, url } = req.body;
            const updateTodoist = await pool.query("INSERT INTO todoist (userid, projectid, url) VALUES ($1, $2, $3)", [userid, projectid, url]);
            logger.trace("Todoist project info be added to database for user " + userid)
        } catch (err) {
            const { userid } = req.body;
            logger.error("Todoist project info could not be added to database for user " + userid + "\n error message: " + err.message)
        }
    })

    //update the user's labels
    app.put("/api/todoist/labels", async (req, res) => {
        try {
            const { labelJSON, userid } = req.body
            const updateLabels = pool.query("UPDATE todoist SET labels=$1 WHERE userid=$2", [labelJSON, userid])
            logger.trace(`Labels added to database for user ${userid}`)
        } catch (err) {
            logger.trace(`Labels could not be added to database for user ${userid}. Error message: ${err.message}`)
        }
    })

    //update the user's sections
    app.put("/api/todoist/sections", async (req, res) => {
        try {
            const { sectionJSON, userid } = req.body
            const updateSections = pool.query("UPDATE todoist SET sections=$1 WHERE userid=$2", [sectionJSON, userid])
            logger.trace(`Sections added to database for user ${userid}`)
        } catch (err) {
            logger.trace(`Sections could not be added to database for user ${userid}. Error message: ${err.message}`)
        }
    })
}