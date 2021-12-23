require("dotenv").config();
const fetch = require('isomorphic-unfetch')

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
 * gets all onedrive cloud users and refreshes their access tokens (runs every 55 minutes, access
 * tokens expire every 60 minutes)
 */
const refreshAccessTokens = async () => {
    //get all onedrive users
    console.log('go')
    try {
        await fetch(`${process.env.BASE_REQUEST_URL}/api/onedrive/getusers`)
            .then(response => response.json())
            .then(async data => {
                for (let i = 0; i < data.length; i++) {
                    try {
                        logger.trace(`{refreshAccessTokens} Refreshing access token for user ${data[i].uid}`)
                        await fetch(`${process.env.BASE_REQUEST_URL}/api/onedrive/refresh/${data[i].uid}`, { method: 'PUT' })
                    } catch (err) {
                        logger.trace(`{refreshAccessTokens} Access token failed for user ${data[i].uid}`)
                    }
                }
            })
    } catch (err) {
        logger.trace(`{refreshAccessTokens} Access token failed for user ${data[i].uid}`)
    }

    setTimeout(refreshAccessTokens, 3300000)
}

/**
 * finds all files that a studyflow entry has not been created for
 * 
 * (1) gets all active flows with a path
 * (2) gets the current folder contents of each flow
 * (3) finds the difference between the past folder status (1hr ago) and current folder
 */
const getDifferences = async () => {
    let pastData;
    let newData;
    // (1)
    await fetch(`${process.env.BASE_REQUEST_URL}/api/flows/onedrive/active`)
        .then(response => response.json())
        .then(data => {
            pastData = data
        })
    for (let i = 0; i < pastData.length; i++) {
        //get user for cloud access token
        await fetch(`${process.env.BASE_REQUEST_URL}/api/userbyid/${pastData[i].userid}`)
            .then(response => response.json())
            .then(async data => {
                const json = {
                    access_token: data.cloudaccess,
                    driveid: pastData[i].driveid,
                    childid: pastData[i].folderid 
                }
                // (2)
                await fetch(`${process.env.BASE_REQUEST_URL}/api/onedrive/children`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(json)
                })
                    .then(response => response.json())
                    .then(data => {
                        const files = data.filter(x => x.file)
                        // (3)
                        const difference = files.filter(
                            x => !pastData[i].pastfiles.some(file => file.id === x.id)
                        )
                        console.log(difference)
                    })
            })
    }
}



module.exports = { refreshAccessTokens, getDifferences }