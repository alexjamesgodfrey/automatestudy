require("dotenv").config();

var log4js = require("log4js");
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
 * intializes the user's studyflow todoist
 * 
 * (1) creates a project
 * (2) creates a section for each class
 * (3) adds project details to database
 * 
 * @param {String} access_token the user's todoist access token
 * @param {String} title title of the todoist project
 * @param {Integer} user_id the user's id pk
 * @param {Array} classes_array an array of the user's classes
 */
const initializeTodoist = async (access_token, title, user_id, classes_array) => {
    logger.trace(`{intializeTodist} Intializing todoist project for ${user_id}`)
    const projectJSON = `{
        "name": "${title}",
        "color": 37,
        "favorite": true
    }`
    await fetch(`https://api.todoist.com/rest/v1/projects`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
        body: projectJSON
    })
    .then(response => response.json())
    .then(async data => {
        logger.trace(`{intializeTodoist} Todoist project ${data.id} created for ${user_id}`)
        const dbJSON = {
            userid: user_id,
            projectid: data.id,
            url: data.url
        }
        createSections(classes_array, data.id, access_token, user_id)
        createLabels(access_token, user_id)
        logger.trace(`{intializeTodoist} Adding project details to database for ${user_id}`)
        await fetch(`${process.env.BASE_REQUEST_URL}/api/todoist/project`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dbJSON)
        })
        
    })
}

const createSections = async (classes, projectid, access_token, user_id) => {
    logger.trace(`{createSections} Creating project sections in project ${projectid}`)
    const sectionArr = []
    for (let i=0; i<classes.length; i++) {
        const sectionJSON = {
            project_id: projectid,
            name: classes[i]
        }
        await fetch(`https://api.todoist.com/rest/v1/sections`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(sectionJSON)
        })
            .then(response => response.json())
            .then(data => {
                sectionArr.push({
                    name: data.name,
                    id: data.id
                })
                createTask(
                    access_token,
                    `Welcome to ${classes[i]} Section`,
                    `All your tasks (add homeworks, quizzes, etc!) for ${classes[i]} go here`,
                    null, 
                    data.id,
                    null, 
                    'today'
                )
            })
    }
    await fetch(`${process.env.BASE_REQUEST_URL}/api/todoist/sections`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sectionJSON: sectionArr,
            userid: user_id
        })
    })
}

/**
 * 
 * @param {String} access_token the user's todoist access token
 * @param {Integer} user_id the user's id
 */
const createLabels = async (access_token, user_id) => {
    logger.trace(`{creatLabels} Creating labels for token ${access_token}`)
    const labels = ['review', 'reading', 'computer', 'library', 'relax', 'dorm']
    const labelColors = [37, 38, 48, 35, 40, 31]
    const labelArr = []
    for (let i = 0; i < labels.length; i++) {
        await fetch('https://api.todoist.com/rest/v1/labels', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify({
                name: labels[i],
                color: labelColors[i]
            })
        })
            .then(response => response.json())
            .then(async data => {
                labelArr.push({
                    name: data.name,
                    id: data.id
                })
                createTask(access_token, `Sample ${data.name} task`, null, null, null, [data.id], 'today')
            })
    }
    await fetch(`${process.env.BASE_REQUEST_URL}/api/todoist/labels`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            labelJSON: labelArr,
            userid: user_id
        })
    })
}

const createTask = async (access_token, content, description, project_id, section_id, labels, due_string) => {
    let json;
    if (project_id) {
        json = {
            content: content,
            description: description,
            project_id, project_id,
            label_ids: labels,
            due_string: due_string
        }
    } else if (section_id) {
        json = {
            content: content,
            description: description,
            section_id, section_id,
            label_ids: labels,
            due_string: due_string
        }
    }
    else {
        json = {
            content: content,
            description: description,
            label_ids: labels,
            due_string: due_string
        }
    }
    await fetch(`https://api.todoist.com/rest/v1/tasks`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify(json)
    })
}

module.exports = { initializeTodoist, createTask }