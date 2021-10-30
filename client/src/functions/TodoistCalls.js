const getTodoistProjects = async (token) => {
    await fetch('https://api.todoist.com/rest/v1/projects', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {console.log(data)})
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

const createTodoistProject = async (title, token) => {
    const projectJSON = `{
        "name": "${title}",
        "color": 37,
        "favorite": true
    }`
    await fetch(`https://api.todoist.com/rest/v1/projects?favorite=true`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: projectJSON
    })
}

const createTodoistProjectSections = async (classes, token) => {
    console.log('test')
}

export { getTodoistProjects, getSectionsOfTodoistProject }
export { createTodoistProject }