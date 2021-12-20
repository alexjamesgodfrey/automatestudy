/**
 * TODOIST ROUTES
 */
require("dotenv").config();
const fetch = require('isomorphic-unfetch')
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

/**
 * requests an access code from todoists api then stores it in 
 * database.
 * @param {String} code todoist grant code that is used to obtain access token
 * @param {String} uid the user's uid
 */
const getAccessToken = async (code, uid) => {
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
    app.put("/api/todoist/initialize/:code/:uid", async (req, res) => {
        try {
            const { code, uid } = req.params;
            logger.trace("Todoist access token fetch requested for user " + uid)
            getAccessToken(code, uid)
        } catch (err) {
            console.error(err.message);
        }
    })

    //adds user's todoist information to db
    app.post("/api/todoist/store/:uid", async (req, res) => {
        try {
            const { uid } = req.params;
            const { access_token } = req.body;
            const updateUsers = await pool.query("UPDATE users set todoistaccess=$1 WHERE uid = $2", [access_token, uid]);
            logger.trace("Todoist access token successfully added to users database for user " + uid)
        } catch (err) {
            console.error(err.message);
        }
    })    
}