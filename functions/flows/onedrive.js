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

const notionImports = require('./notion')
const Todoist = require('./todoist')

/**
 * gets all onedrive cloud users and refreshes their access tokens (runs every 55 minutes, access
 * tokens expire every 60 minutes)
 */
const refreshAccessTokens = async () => {
    //get all onedrive users
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
 * (4) creates a notion entry for each difference
 * (5) creates set of todoist tasks for each difference
 * (6) updates the pastfiles in database
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
                const userData = data
                const json = {
                    access_token: userData.cloudaccess,
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
                    .then(async data => {
                        const files = data.filter(x => x.file)
                        // (3)
                        const difference = files.filter(
                            x => !pastData[i].pastfiles.some(file => file.id === x.id)
                        )
                        // get notion info for databaseid
                        await fetch(`${process.env.BASE_REQUEST_URL}/api/notion/${userData.id}`)
                            .then(response => response.json())
                            .then(data => {
                                console.log(difference)
                                // (4)
                                for (let j = 0; j < difference.length; j++) {
                                    notionImports.createPageInDatabase(
                                        userData.notionaccess,
                                        data.database_id,
                                        difference[j].name,
                                        difference[j].lastModifiedDateTime.substring(0, 10),
                                        difference[j].parentReference.name //folder name
                                    )
                                }
                            })
                        // get todoist info for section id
                        await fetch(`${process.env.BASE_REQUEST_URL}/api/todoist/${userData.id}`)
                            .then(response => response.json())
                            .then(data => {
                                // (5)
                                for (let k = 0; k < difference.length; k++) {
                                    Todoist.createTask(
                                        userData.todoistaccess,
                                        `Create Active Recall Questions for ${difference[k].name}`,
                                        null,
                                        null,
                                        data.sections.find(section => section.name === difference[k].parentReference.name).id,
                                        [data.labels.find(label => label.name === 'review').id],
                                        'today'
                                    )
                                    Todoist.createTask(
                                        userData.todoistaccess,
                                        `(1) Review ${difference[k].name}`,
                                        null,
                                        null,
                                        data.sections.find(section => section.name === difference[k].parentReference.name).id,
                                        [data.labels.find(label => label.name === 'review').id],
                                        'tomorrow'
                                    )
                                    Todoist.createTask(
                                        userData.todoistaccess,
                                        `(2) Review ${difference[k].name}`,
                                        null,
                                        null,
                                        data.sections.find(section => section.name === difference[k].parentReference.name).id,
                                        [data.labels.find(label => label.name === 'review').id],
                                        'in 3 days'
                                    )
                                    Todoist.createTask(
                                        userData.todoistaccess,
                                        `(3) Review ${difference[k].name}`,
                                        null,
                                        null,
                                        data.sections.find(section => section.name === difference[k].parentReference.name).id,
                                        [data.labels.find(label => label.name === 'review').id],
                                        'in 7 days'
                                    )
                                    Todoist.createTask(
                                        userData.todoistaccess,
                                        `(4) Review ${difference[k].name}`,
                                        null,
                                        null,
                                        data.sections.find(section => section.name === difference[k].parentReference.name).id,
                                        [data.labels.find(label => label.name === 'review').id],
                                        'in 30 days'
                                    )
                                }
                            })
                        //(6)
                        await fetch(`${process.env.BASE_REQUEST_URL}/api/flows/pastfiles/${pastData[i].id}`, {
                            method: "PUT",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                pastfiles: files
                            })
                        })
                    })
            })
    }
}



module.exports = { refreshAccessTokens, getDifferences }