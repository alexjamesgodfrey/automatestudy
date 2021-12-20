/**
 * ONEDRIVE ROUTES
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
 * exchanges the user's onedrive authentication code with a short-lived access token and refresh token
 * adds these tokens to the database
 * @param {String} code the code to exchange for an access token
 * @param {String} uid the user's uid
 */
const getAccessToken = async (code, uid) => {
    const tokenDetails = {
        'grant_type': 'authorization_code',
        'client_id': process.env.ONEDRIVE_CLIENT,
        'scope': 'files.read',
        'code': code,
        'redirect_uri': process.env.REDIRECT_URI,
        'client_secret': process.env.ONEDRIVE_SECRET_VALUE
    }
    const formBody = [];
    for (let property in tokenDetails) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(tokenDetails[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    const joined = formBody.join('&')
    try {
        await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: joined
        })
        .then(response => response.json())
        .then(async data => {
            logger.trace("OneDrive access token received from Microsoft for user " + uid)
            const accessToken = data.access_token
            //we do not want to add a null access token
            if (data.access_token) {
                await fetch(`${process.env.BASE_REQUEST_URL}/api/onedrive/store/${uid}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
            }
            
        })
    } catch (err) {
        logger.error("OneDrive access token could not be fetched and added to database for user " + uid + "\nError message: " + err.message)
    }
}
 
module.exports = function (app) {
    //calls getAccessToken function
    app.put("/api/onedrive/initialize/:code/:uid", async (req, res) => {
        try {
            const { code, uid } = req.params;
            logger.trace("OneDrive access token fetch requested for user " + uid)
            getAccessToken(code, uid)
        } catch (err) {
            console.error(err.message);
        }
    })

    //adds user's onedrive information to db
    app.put("/api/onedrive/store/:uid", async (req, res) => {
        try {
            const { uid } = req.params;
            const { access_token, refresh_token } = req.body;
            const changeOnedrive = await pool.query("UPDATE users set cloud='OneDrive', cloudaccess=$1, cloudrefresh=$2 WHERE uid = $3", [access_token, refresh_token, uid]);
            logger.trace("OneDrive access token successfully added to database for user " + uid)
        } catch (err) {
            console.error(err.message);
        }
    })
}

