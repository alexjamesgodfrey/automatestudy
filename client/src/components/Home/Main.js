import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import _, { first, property } from 'underscore'
import { useAuth } from '../../contexts/AuthContext'
import { createTodoistProject } from '../../functions/TodoistCalls'
import FlowCard from './FlowCard'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Flows from './Flows'
import FlowDisplay from './FlowDisplay'

export default function Main() {
    const { currentUser, userDB, surveyResponse, flowList } = useAuth()
    const [showModal, setShowModal] = useState(false)
    const [classLoading, setClassLoading] = useState(false)
    const [currentClass, setCurrentClass] = useState('')
    const [currentClassKey, setCurrentClassKey] = useState(0)
    const [userFlows, setUserFlows] = useState([])
    const search = useLocation().search
    const todoistClient = process.env.REACT_APP_TODOIST_CLIENT
    const todoistSecret = process.env.REACT_APP_TODOIST_SECRET
    const todoistURL = `https://todoist.com/oauth/authorize?client_id=${todoistClient}&scope=data:read_write,data:delete&state=${todoistSecret}`
    const notionClient = process.env.REACT_APP_NOTION_CLIENT
    const notionState = process.env.REACT_APP_NOTION_SECRET
    const notionURL = `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=${notionClient}&redirect_uri=http%3A%2F%2Flocalhost%3A0&response_type=code&state=${notionState}`
    const onedriveClient = process.env.REACT_APP_ONEDRIVE_CLIENT
    const onedriveState = 'onedrive'
    const onedriveURL = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${onedriveClient}&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_mode=query&scope=files.read.all%20user.read&state=${onedriveState}`

    
    const checkTodoist = async () => {
        /*
        The following function checks the url for code and secret parameters for
        Todoist connection, and adds the user's code and token after generation to 
        the user database if present.
        */
        if (!userDB.todoistCode){
            console.log('Todoist not found')
            const code = await new URLSearchParams(search).get('code');
            const state = await new URLSearchParams(search).get('state');
            if (code && state === todoistSecret){
                await fetch(`/api/users/todoistcode/${code}/${currentUser.uid}`, {
                    method: 'PUT'
                })
                await fetch(`https://todoist.com/oauth/access_token?client_id=${todoistClient}&client_secret=${todoistSecret}&code=${code}`, {
                    method: 'POST'
                })
                .then(response => response.json())
                .then(async data => {
                    if (data.access_token){
                        await fetch(`/api/users/todoisttoken/${data.access_token}/${currentUser.uid}`, {
                            method: 'PUT'
                        })
                    }
                })
        }
        }
    }

    const checkNotion = async () => {
        if (!userDB.notioncode){
            console.log('Notion not found')
            const code = new URLSearchParams(search).get('code');
            const state = new URLSearchParams(search).get('state');
            if (code && state === notionState){
                console.log('adding notioncode to user')
                await fetch(`/api/users/notioncode/${code}/${currentUser.uid}`, {
                    method: 'PUT'
                })
            }
        }
    }

    const checkOnedrive = async () => {
        if (!userDB.onedrivecode){
            console.log('OneDrive not found')
            const code = new URLSearchParams(search).get('code');
            const state = new URLSearchParams(search).get('state');
            if (code && state === onedriveState){
                console.log('adding onedrivecode to user')
                await fetch(`/api/users/onedrivecode/${code}/${currentUser.uid}`, {
                    method: 'PUT'
                })
            }
        }
    }

    const createProject = async () => {
        if (!(userDB.projectid)) {
            createTodoistProject(surveyResponse.classesarray[0] + ' ' + currentUser.uid, userDB.todoisttoken, currentUser.uid)
        }
    }

    // const getAllFlows = async () => {
    //     if (surveyResponse.media = 'Digital Writing (iPad, Surface)'){
    //         let tasks
    //         let cloud
    //         if (surveyResponse.tools.indexOf('Todoist') !== -1){
    //             tasks = 'Todoist'
    //         }
    //         else {
    //             tasks = 'StudyTasks'
    //         }
    //         if (!(surveyResponse.cloud)) {
    //             await fetch(`/api/flows/nocloud/${surveyResponse.apporcloud}/${tasks}`)
    //             .then(response => response.json())
    //             .then(data => {
    //                 setFlowList(data)
    //             })
    //         }
    //         await fetch(`/api/flows/cloud/${surveyResponse.apporcloud}/${surveyResponse.cloud}/${tasks}`)
    //             .then(response => response.json())
    //             .then(data => {
    //                 setFlowList(data)
    //             })
    //     }
    //     console.log(classLoading)
    // }

    // const getCategory = (obj) => {
    //     console.log(obj)
    //     const cat = _.chain(obj).pick('tags').value().tags
    //     // .pick(['Notability', 'OneDrive']).values().join(' ').value()
    //     console.log(cat)
    //     return cat
    // }

    // const getFlows = async () => {
    //     await fetch('/api/flows')
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log(data)
    //         let firstGrouping = _.groupBy(data, (obj) => {
    //             return obj.tags[0]
    //         })
    //         console.log(firstGrouping)
    //         const groupingArray = []
    //         for (const property in firstGrouping){
    //             firstGrouping[property] =  _.groupBy(firstGrouping[property], (obj) => {
    //                     return obj.tags[1]
    //                 })
    //             for (const property2 in firstGrouping[property]){
    //                 firstGrouping[property][property2] =  _.groupBy(firstGrouping[property][property2], (obj) => {
    //                     return obj.tags[2]
    //                 })
    //             }
    //         }
    //         setFlowList(firstGrouping)
    //         console.log(firstGrouping)
            
    //     })
    //     .then((firstGrouping) => console.log(firstGrouping))
    // }

    const setFlow = async (id) => {
        let userFlows = userDB.flows
        userFlows.splice(currentClassKey, 1, id)
        const bod = `{
            "flows": [${userFlows}],
            "uid": "${currentUser.uid}"
        }`
        await fetch('/api/users/flows/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: bod
        })
        .then(() => {
            setShowModal(false)
            setClassLoading(false)
        })
    }

    useEffect(() => {
        checkTodoist()
        checkNotion()
        checkOnedrive()
        console.log(flowList)
        console.log(classLoading)
    }, [])

    return (
        <div style={{width: '100vw' }}>
            <h4 style={{ textAlign: 'center', margin: '20px'}}>Welcome, <span style={{ textTransform: 'capitalize'}}>{currentUser.displayName}</span> | {surveyResponse.grade} at {surveyResponse.college}</h4>
            <div style={{margin: '20px 20px' }} className="d-flex flex-column justify-content-center"> 
                <h4>Your classes</h4>  
                <div className="d-flex flex-column align-items-center justify-content-center">
                {surveyResponse.classesarray.map((c, i) => {
                    return (
                        <div>
                            {parseInt(userDB.flows[i]) === 0 ?
                                <Card style={{ width: '300px', marginBottom: '20px', height: '150px' }}>
                                    <Card.Header as="h5">{c}</Card.Header>
                                        <Card.Body 
                                            style={{ cursor: 'pointer '}}
                                            onClick={() => {
                                                setCurrentClass(c)
                                                setCurrentClassKey(i)
                                                setShowModal(true)
                                                setClassLoading(true)}
                                            } 
                                        >
                                            {classLoading ? 
                                                <div style={{marginTop: '20px'}} className="d-flex justify-content-center">
                                                    <Spinner animation="border" />
                                                </div>
                                                :
                                                <Card.Text>
                                                    <p style={{textAlign: 'center', marginTop: '20px'}} >click to add a <strong>studyflow</strong></p>
                                                </Card.Text>  
                                            }
                                        </Card.Body>
                                </Card>
                            :   
                                <FlowCard 
                                    classKey={i} 
                                    userDB={userDB} 
                                    currentUser={currentUser} 
                                    flowList={flowList} c={c} 
                                    flowid={userDB.flows[i]} 
                                    onedriveURL={onedriveURL}
                                />
                            }
                        </div>
                    )})
                }
                </div>
                <Modal show={showModal} onHide={() => {
                        setClassLoading(false)
                        setShowModal(false)
                    }}>
                    <Modal.Header closeButton>
                    <Modal.Title>Add studyflow for {currentClass}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <p><strong>Filters:</strong></p>
                            <div className="d-flex justify-content-around flex-wrap">
                                <DropdownButton id="dropdown-basic-button" title="Note-taking Media">
                                    <Dropdown.Item href="#/action-1">Notability</Dropdown.Item>
                                    <Dropdown.Item href="#/action-2">Goodnotes</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">OneDrive</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">Paper</Dropdown.Item>
                                </DropdownButton>
                                <DropdownButton id="dropdown-basic-button" title="Cloud Service">
                                    <Dropdown.Item href="#/action-1">OneDrive</Dropdown.Item>
                                    <Dropdown.Item href="#/action-2">Google Drive</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">Dropbox</Dropdown.Item>
                                </DropdownButton>
                                <DropdownButton id="dropdown-basic-button" title="Difficulty">
                                    <Dropdown.Item href="#/action-1">Easy</Dropdown.Item>
                                    <Dropdown.Item href="#/action-2">Average</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">Hard</Dropdown.Item>
                                </DropdownButton>
                            </div>
                        </div>
                        {flowList.map((flow, key) => {
                            return (
                            <div 
                                onClick={() => setFlow(flow.id)}
                                style={{ border: '2px solid lightgrey', padding: '10px', margin: '20px 0px', borderRadius: '1%', cursor: 'pointer'}}
                            >
                                <FlowDisplay showDifficulty={true} flow={flow} />
                            </div>)
                        })}
                        {/* <Flows classIndex={currentClassKey} user={userDB} surveyResponse={surveyResponse} class={currentClass} flowList={flowList}/> */}
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    </Modal.Footer>
                </Modal>
                {/* <Card style={{ width: '300px', margin: '15px' }}>
                    <Card.Header as="h5">Next Steps</Card.Header>
                    <Card.Body>
                        <Card.Text>
                            {userDB.todoistcode ?
                                <span style={{height: '40px', color: '#4BB543', textDecoration: 'line-through'}}>1. Connect Todoist Account</span>
                                :
                                <div className="d-flex justify-content-between align-items-center"><span>1. Connect Todoist Account</span><a href={todoistURL}><Button variant="danger">go</Button></a></div>
                            }       
                        </Card.Text>    
                        <Card.Text>
                            {userDB.notioncode ?
                                <span style={{color: '#4BB543', textDecoration: 'line-through'}}>2. Connect Notion Account</span>
                                :
                                <div className="d-flex justify-content-between align-items-center"><span>2. Connect Notion Account</span><a href={notionURL}><Button variant="dark">go</Button></a></div>
                            }       
                        </Card.Text>    
                        <Card.Text>
                            {userDB.onedrivecode ?
                                <span style={{color: '#4BB543', textDecoration: 'line-through'}}>3. Connect OneDrive Account</span>
                                :
                                <div className="d-flex justify-content-between align-items-center"><span>3. Connect OneDrive Account</span><a href={onedriveURL}><Button variant="info">go</Button></a></div>
                            }       
                        </Card.Text>    
                    </Card.Body>
                </Card> */}
            </div>
        </div>
    )
}
