const getTodoistProjects = async (token) => {
    await fetch('https://api.todoist.com/rest/v1/projects', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}