/**
 * NOTION ROUTES
 */
require("dotenv").config();
const fetch = require('isomorphic-unfetch')
let base64 = require('base-64');
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
 * requests an access code from notions api then stores it in 
 * database.
 * @param {String} code notion grant code that is used to obtain access token
 * @param {String} uid the user's uid
 * @param {String} user_id the user's user_id (in relational database)
 */
const getAccessToken = async (code, uid, user_id) => {
    const body = `{
        "grant_type": "authorization_code",
        "code": "${code}",
        "redirect_uri": "${process.env.REDIRECT_URI}"
    }`
    try {
        await fetch(`https://api.notion.com/v1/oauth/token`, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + base64.encode(process.env.NOTION_CLIENT + ":" + process.env.NOTION_SECRET),
                'Content-Type': 'application/json'
            }, 
            body: body
        })
        .then(response => response.json())
        .then(async data => {
            logger.trace("Notion access token received from Notion for user " + uid)
            if (data.access_token) {
                await fetch(`${process.env.BASE_REQUEST_URL}/api/notion/store/${uid}/${user_id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
            }
        })
    } catch (err) {
        logger.error("Notion access token could not be fetched and added to database for user " + uid + "\nError message: " + err.message)
    }
    
}

module.exports = function (app) {
    //calls getAccessToken function
    app.put("/api/notion/initialize/:code/:uid/:userid", async (req, res) => {
        try {
            const { code, uid, userid } = req.params;
            logger.trace("Notion access token fetch requested for user " + uid)
            getAccessToken(code, uid, userid)
        } catch (err) {
            logger.error("Notion access token fetch failed for user " + uid + "\n error message: " + err.message)
        }
    })

    //adds user's notion information to db
    app.post("/api/notion/store/:uid/:userid", async (req, res) => {
        try {
            const { uid, userid } = req.params;
            const { access_token, workspace_id, workspace_name, workspace_icon, bot_id, owner } = req.body;
            const updateUsers = await pool.query("UPDATE users set notionaccess=$1 WHERE uid = $2", [access_token, uid]);
            logger.trace("Notion access token successfully added to users database for user " + uid)
            const insertNotion = await pool.query(
                "INSERT INTO notion (userid, access_token, workspace_id, workspace_name, workspace_icon, bot_id, owner) VALUES ($1, $2, $3, $4, $5, $6, $7)", 
                [parseInt(userid), access_token, workspace_id, workspace_name, workspace_icon, bot_id, owner]);
            logger.trace("Notion information successfully added to notion database for user " + uid)
            res.json("Notion information successfully added to notion database for user " + uid)
        } catch (err) {
            logger.error("Notion access token could not be added to database for user " + uid + "\n error message: " + err.message)
        }
    })

    app.get('/api/notion', async (req, res) => {
        try {
            const getAll = await pool.query(
                "SELECT * FROM notion"
            )
            res.json(getAll.rows)
        } catch (err) {
            console.error(err.message)
        }
    })

    app.put('/api/notion/database/:userid', async (req, res) => {
        try {
            const { userid } = req.params
            const { id, url } = req.body
            const getAll = await pool.query(
                "UPDATE notion SET database_id=$1, database_url=$2 WHERE userid=$3", 
                [id, url, parseInt(userid)])
            res.json(getAll.rows)
        } catch (err) {
            console.error(err.message)
        }
    })

    
}