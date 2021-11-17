const fetch = require('isomorphic-unfetch')
let base64 = require('base-64');
require("dotenv").config();

/**
 * getAccessToken requests an access code from notions api then stores it in 
 * database.
 * @param {String} code notion grant code that is used to obtain access token
 * @param {String} userid the users main userid used in relational database
 */
const getAccessToken = async (code, userid) => {
    const body = `{
        "grant_type": "authorization_code",
        "code": "${code}",
        "redirect_uri": "http://localhost:3000"
    }`
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
        console.log(JSON.stringify(data))
        await fetch(`${process.env.BASE_REQUEST_URL}/api/notioninformation/initial/${userid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    })
}

module.exports.getAccessToken = getAccessToken