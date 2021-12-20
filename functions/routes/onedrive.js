/**
 * MAIN ROUTES
 */
const fetch = require('isomorphic-unfetch')
require("dotenv").config();
const pool = require("../db.js");

const getAccessToken = async (code, uid) => {
    const tokenDetails = {
        'grant_type': 'authorization_code',
        'client_id': process.env.REACT_APP_ONEDRIVE_CLIENT,
        'scope': 'files.read',
        'code': code,
        'redirect_uri': process.env.REACT_APP_REDIRECT_URI,
        'client_secret': process.env.REACT_APP_ONEDRIVE_SECRET_VALUE
    }
    const formBody = [];
    for (let property in tokenDetails) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(tokenDetails[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    const joined = formBody.join('&')
    console.log(joined)
    await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: joined
    })
    .then(response => response.json())
    .then(async data => {
        const accessToken = data.access_token
        console.log(accessToken)
        await fetch(`${process.env.BASE_REQUEST_URL}/api/users/onedrive/${uid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    })
}
 
module.exports = function (app) {
    app.put("/api/users/initializeonedrive/:code/:uid", async (req, res) => {
        try {
            const { code, uid } = req.params;
            getAccessToken(code, uid)
        } catch (err) {
            console.error(err.message);
        }
    })

    //onedrive initialization
    app.put("/api/users/onedrive/:uid", async (req, res) => {
        try {
            const { uid } = req.params;
            const { access_token, refresh_token } = req.body;
            const changeOnedrive = await pool.query("UPDATE users set cloud='OneDrive', cloudaccess=$1, cloudrefresh=$2 WHERE uid = $3", [access_token, refresh_token, uid]);
            res.json(changeOnedrive.rows);
        } catch (err) {
            console.error(err.message);
        }
    })
}

