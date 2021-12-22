/**
 * ONEDRIVE ROUTES
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
 * exchanges the user's onedrive authentication code for a short-lived access token and refresh token
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

/**
 * exchanges the user's onedrive refresh token for a short-lived access token
 * adds this tokens to the database
 * @param {String} refresh the refresh token to exchange for an access token
 * @param {String} uid the user's uid
 */
const getAccessTokenFromRefresh = async (refresh, uid) => {
    const tokenDetails = {
        'grant_type': 'refresh_token',
        'client_id': process.env.ONEDRIVE_CLIENT,
        'scope': 'files.read',
        'refresh_token': refresh,
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
            logger.trace("[Refresh] OneDrive access token received from Microsoft for user " + uid)
            //we do not want to add a null access token
            if (data.access_token) {
                await fetch(`${process.env.BASE_REQUEST_URL}/api/onedrive/updatetoken/${uid}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
            }
            return data.access_token
        })
    } catch (err) {
        logger.error("OneDrive access token could not be fetched and added to database for user " + uid + "\nError message: " + err.message)
    }
}
 
module.exports = function (app) {
    //calls getAccessToken function -> run on OneDrive initialization
    app.put("/api/onedrive/initialize/:code/:uid", async (req, res) => {
        try {
            const { code, uid } = req.params;
            logger.trace("[Intiialization] OneDrive access token fetch requested for user " + uid)
            getAccessToken(code, uid)
            res.json("[Intiialization] OneDrive access token fetch requested for user " + uid)
        } catch (err) {
            const { uid } = req.params;
            logger.error("[Intiialization] OneDrive access token fetch failed for user " + uid + "\n error message: " + err.message)
        }
    })

    //fetches refresh token from uid and generates a fresh access token
    app.put("/api/onedrive/refresh/:uid", async (req, res) => {
        try {
            const { uid } = req.params;
            logger.trace("[Refresh] OneDrive access token fetch requested for user " + uid)
            await fetch(`${process.env.BASE_REQUEST_URL}/api/users/${uid}`)
                .then(response => response.json())
                .then(data => {
                    const accessToken = getAccessTokenFromRefresh(data.cloudrefresh, uid)
                    res.json(accessToken)
                })
            
        } catch (err) {
            const { uid } = req.params;
            logger.error("[Refresh] OneDrive access token fetch failed for user " + uid + "\n error message: " + err.message)
        }
    })

    //adds user's onedrive information to db
    app.put("/api/onedrive/store/:uid", async (req, res) => {
        try {
            const { uid } = req.params;
            const { access_token, refresh_token } = req.body;
            const changeOnedrive = await pool.query("UPDATE users set cloud='OneDrive', cloudaccess=$1, cloudrefresh=$2 WHERE uid = $3", [access_token, refresh_token, uid]);
            logger.trace("[Intiialization] OneDrive access token successfully added to database for user " + uid)
        } catch (err) {
            const { uid } = req.params;
            logger.error("[Intiialization] OneDrive access token could not be added to database for user " + uid + "\n error message: " + err.message)
        }
    })

    //updates the user's access token (used when new access token is generated from refresh token)
    app.put("/api/onedrive/updatetoken/:uid", async (req, res) => {
        try {
            const { uid } = req.params;
            const { access_token } = req.body;
            await pool.query("UPDATE users set cloudaccess=$1 WHERE uid = $2", [access_token, uid]);
            logger.trace("[Refresh] OneDrive access token successfully added to database for user " + uid)
        } catch (err) {
            const { uid } = req.params;
            logger.error("[Refresh] OneDrive access token could not be added to database for user " + uid + "\n error message: " + err.message)
        }
    })

    //get the user's drives
    app.put("/api/onedrive/drives", async (req, res) => {
        try {
            const { access_token, refresh_token } = req.body;
            //fetch from microsoft
            await fetch(`${process.env.BASE_MICROSOFT_URL}/drives`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                }
            })
                .then(response => response.json())
                .then(async data => {
                        res.json(data.value)
                })
        } catch (err) {
            console.error(err.message);
        }
    })

    //get drive children
    app.put("/api/onedrive/children", async (req, res) => {
        try {
            const { access_token, driveid, childid } = req.body
            //fetch from microsoft
            if (childid) {
                await fetch(`${process.env.BASE_MICROSOFT_URL}/drives/${driveid}/items/${childid}/children`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                    }
                })
                    .then(response => response.json())
                    .then(async data => {
                        res.json(data.value)
                    })
            }
            await fetch(`${process.env.BASE_MICROSOFT_URL}/drives/${driveid}/root/children`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                }
            })
                .then(response => response.json())
                .then(async data => {
                    res.json(data.value)
                })
            
        } catch (err) {
            console.error(err.message);
        }
    })
}

