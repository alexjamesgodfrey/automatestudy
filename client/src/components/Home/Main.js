import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { createTodoistProject } from '../../functions/TodoistCalls'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Dropdown from 'react-bootstrap/Dropdown'
import Flows from './Flows'

export default function Main() {
    const { currentUser, userDB, surveyResponse } = useAuth()
    const [showModal, setShowModal] = useState(false)
    const [currentClass, setCurrentClass] = useState('')
    const [difficulty, setDifficulty] = useState('Average')
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

    
    // const checkTodoist = async () => {
    //     /*
    //     The following function checks the url for code and secret parameters for
    //     Todoist connection, and adds the user's code and token after generation to 
    //     the user database if present.
    //     */
    //     if (!userDB.todoistCode){
    //         const code = await new URLSearchParams(search).get('code');
    //         const state = await new URLSearchParams(search).get('state');
    //         if (code && state === todoistSecret){
    //             await fetch(`/api/users/todoistcode/${code}/${currentUser.uid}`, {
    //                 method: 'PUT'
    //             })
    //             await fetch(`https://todoist.com/oauth/access_token?client_id=${todoistClient}&client_secret=${todoistSecret}&code=${code}`, {
    //                 method: 'POST'
    //             })
    //             .then(response => response.json())
    //             .then(async data => {
    //                 if (data.access_token){
    //                     await fetch(`/api/users/todoisttoken/${data.access_token}/${currentUser.uid}`, {
    //                         method: 'PUT'
    //                     })
    //                 }
    //             })
    //     }
    //     }
    // }

    const checkNotion = async () => {
        if (!userDB.notioncode){
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

    useEffect(() => {
        // checkTodoist()
        createProject()
        checkNotion()
        checkOnedrive()
    })

    return (
        <div style={{width: '100vw' }}>
            <h4 style={{ textAlign: 'center', margin: '20px'}}>welcome, {currentUser.displayName} | {surveyResponse.grade} at {surveyResponse.college}</h4>
            <div style={{margin: '20px 0px' }} className="d-flex flex-column justify-content-center">
                {surveyResponse.classesarray.map((c, i) => {
                    return (
                        <Card style={{ width: '300px', margin: '20px', height: '150px' }}>
                            <Card.Header as="h5">{c}</Card.Header>
                            <Card.Body>
                                <Card.Text 
                                    onClick={() => {
                                        setCurrentClass(c)
                                        setShowModal(true)}
                                    } 
                                    style={{ textDecoration: 'underline', textDecorationColor: '#84CACC', cursor: 'pointer'}}
                                >
                                    add a <strong>studyflow</strong>
                                </Card.Text>    
                            </Card.Body>
                        </Card>
                    )
                })}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                    <Modal.Title>Add studyflow for {currentClass}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    Difficulty: {difficulty}
                    <Dropdown style={{margin: '5px 20px 20px 10px'}}>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            Enter relative class difficulty for recommended studyflows
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setDifficulty('Hard')}>Hard</Dropdown.Item>
                            <Dropdown.Item onClick={() => setDifficulty('Average')}>Average</Dropdown.Item>
                            <Dropdown.Item onClick={() => setDifficulty('Easy')}>Easy</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Flows surveyResponse={surveyResponse} />
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => setShowModal(false)}>
                        Save Changes
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
