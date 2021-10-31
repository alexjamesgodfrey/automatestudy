const getTodoistProjects = async (token) => {
    await fetch('https://api.todoist.com/rest/v1/projects', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {response.json()})
    .then(data => console.log(data))
}

const getStudyflowProjectid = async (projects) => {
    for (let i=0; i<projects.length; i++){
        if (projects[i].name === 'studyflow') {
            console.log('id found')
            return projects[i].id
        }
    }
}

const getSectionsOfTodoistProject = async (id, title, token) => {
    const sectionJSON = `{
        "project_id": ${id},
        "name": ${title}
    }`
    await fetch(`https://api.todoist.com/rest/v1/sections`, {
        headers: {
            'Content-Type': 'application/json',
            'Authoization': `Bearer ${token}`
        },
        body: sectionJSON   
    })
    .then(response => response.json())
    .then(data => console.log(data))
}

const createTodoistProject = async (title, token, uid) => {
    const projectJSON = `{
        "name": "${title}",
        "color": 37,
        "favorite": true
    }`
    await fetch(`https://api.todoist.com/rest/v1/projects`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: projectJSON
    })
    .then(response => response.json())
    .then(async data => {
        await fetch(`/api/users/projectid/${data.id}/${uid}`, {
            method: 'PUT'
        })
    })
}

const createTodoistProjectSections = async (classes, projectid, token) => {
    for (let i=0; i<classes.length; i++) {
        const sectionJSON = `{
            "project_id": "${projectid}",
            "name": "${classes[i]}"
        }`
        await fetch(`https://api.todoist.com/rest/v1/sections`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: sectionJSON
        })
    }
}

const todoistSetup = async (classes, token) => {
    await createTodoistProject('studyflow', token)
    getTodoistProjects(token).then(response => {
        console.log('bleh')
    })
}

const createSection = async (sectionName) => {
    const projectid = 2277298898

}

export { todoistSetup, createTodoistProject }