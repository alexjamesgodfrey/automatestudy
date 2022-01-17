import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useLocation } from 'react-router-dom'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Overlay from 'react-bootstrap/Overlay'
import Tooltip from 'react-bootstrap/Tooltip'
import Survey from './Survey'
import Main from './Main'
import FlowDisplay from '../Flow/FlowDisplay'

export default function LoggedIn() {
    const { currentUser, userDB, surveyResponse } = useAuth()

    const [loading, setLoading] = useState(false)
    const [classesConfirmed, setClassesConfirmed] = useState(false)
    const search = useLocation().search
    const code = new URLSearchParams(search).get('code');
    const state = new URLSearchParams(search).get('state');

    const [showGoogleTip, setShowGoogleTip] = useState(false)
    const googleTarget = useRef(null)
    const [showDropboxTip, setShowDropboxTip] = useState(false)
    const dropboxTarget = useRef(null)

    /**
     * uploads the user's classes to the users table, and creates a flow for each class and uploads it
     * to the flows table
     */
    const confirmClasses = async () => {
        if (!loading) {
            //create classes array
            setClassesConfirmed(true)
            setLoading(true)
            const classIds = ['class-one', 'class-two', 'class-three', 'class-four', 'class-five', 'class-six']
            const classNames = []
            for (let i = 0; i < classIds.length; i++) {
                const className = document.getElementById(classIds[i]).value
                if (className) {
                    classNames.push(className)
                }
            }
            //push classes array to userDB
            const json = `{
                "cs": "${classNames}"
            }`
            await fetch(`/api/users/classes/${currentUser.uid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: json
            })
            //create flows and push to db
            for (let i = 0; i < classNames.length; i++) {
                const json = `{
                    "active": false,
                    "c": "${classNames[i]}"
                }`
                await fetch(`/api/flows/create/${userDB.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: json
                })
            }
            setLoading(false)
        }
    }

    /**
     * Checks for onedrive code presence in url and adds if present
     */
    const onedriveURL = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${process.env.REACT_APP_ONEDRIVE_CLIENT}&response_type=code&redirect_uri=${process.env.REACT_APP_REDIRECT_URI_URL}&response_mode=query&scope=offline_access%20files.read&state=onedrive`
    const checkOnedrive = async () => {
        if (code && state === 'onedrive' && !userDB.cloudaccess) {
            await fetch(`/api/onedrive/initialize/${code}/${currentUser.uid}`, {
                method: 'PUT'
            })
        }
    }

    /**
     * Checks for notion code presence in url and adds if present
     */
    const notionURL = `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=${process.env.REACT_APP_NOTION_CLIENT}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI_URL}&response_type=code&state=notion`
    const checkNotion = async () => {
        if (code && state === 'notion' && !userDB.notionaccess) {
            const json = {
                classes_array: userDB.classes
            }
            await fetch(`/api/notion/initialize/${code}/${currentUser.uid}/${userDB.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(json)
            })
        }
    }

    
    /**
     * Checks for todoist code presence in url and adds if present
     */
    const todoistURL = `https://todoist.com/oauth/authorize?client_id=${process.env.REACT_APP_TODOIST_CLIENT}&scope=data:read_write,data:delete&state=todoist`
    const checkTodoist = async () => {
        if (code && state === 'todoist' && !userDB.todoistaccess) {
            const json = {
                classes_array: userDB.classes
            }
            await fetch(`/api/todoist/initialize/${code}/${currentUser.uid}/${userDB.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(json)
            })
        }
    }

    const createUser = async () => {
        try {
            const here = await fetch(`/api/users/${currentUser.uid}`)
            const hereJSON = await here.text()
            if (hereJSON.length === 0) {
                const user = `{
                    "displayname": "${currentUser.displayName}",
                    "email": "${currentUser.email}",
                    "photourl": "${currentUser.photoURL}",
                    "uid": "${currentUser.uid}"
                }`
                await fetch('/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: user
                })
            }
        } catch (error) {}
    }

    useEffect(() => {
        createUser()
        checkOnedrive()
        checkNotion()
        checkTodoist()
    }, [])

    //if setup is complete
    if (surveyResponse && userDB.cloudaccess && userDB.notionaccess && userDB.todoistaccess && userDB.classes) {
        return <Main />
    }

    //setup step: take survey
    if (!surveyResponse) {
        return (
            <div>
                <ProgressBar style={{ margin: '60px auto 20px auto', width: '400px', height: '25px'}} now={16} label={`Setup: 10%`} />
                <div style={{margin: '20px 20px' }} className="d-flex justify-content-center">
                    <Card style={{ width: '300px', margin: '15px' }}>
                        <Card.Header as="h5">Welcome to Studyflow</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                Thanks for signing up. Please take the getting started survey to begin.
                            </Card.Text>  
                            <Card.Text>
                                In 10 minutes, you'll be the most organized student you know.
                            </Card.Text>  
                        </Card.Body>
                    </Card>
                </div>
                <div className="d-flex justify-content-center"><Survey /></div>
            </div>
        )
    }

    //setup step: confirm classes
    if (!userDB.classes && !classesConfirmed) { 
        return (
            <div>
                <ProgressBar style={{ margin: '60px auto 20px auto', width: '400px', height: '25px'}} now={30} label={`Setup: 30%`} />
                <div style={{ margin: '20px 0px 10px 0px' }} className="d-flex justify-content-center">
                    <Card style={{ width: '400px' }}>
                        <Card.Header as="h5">Confirm Your Classes</Card.Header>
                        <Card.Body className="d-flex flex-column">
                            <Card.Text>
                                Thanks for taking the getting started survey. Please confirm your classes.
                                Only enter classes you are currently taking which you plan on taking notes for.
                                If you aren't sure yet, don't worry: classes can be removed and added later.
                            </Card.Text>  
                            <Card.Text><strong> Enter a maximum of 6 classes.</strong></Card.Text>
                            <Form.Control id="class-one" style={{ margin: '8px 0px' }} type="text" defaultValue={surveyResponse.classesarray[0]} placeholder="Class One" />
                            <Form.Control id="class-two" style={{ margin: '8px 0px' }} type="text" defaultValue={surveyResponse.classesarray[1]} placeholder="Class Two" />
                            <Form.Control id="class-three" style={{ margin: '8px 0px' }} type="text" defaultValue={surveyResponse.classesarray[2]} placeholder="Class Three" />
                            <Form.Control id="class-four" style={{ margin: '8px 0px' }} type="text" defaultValue={surveyResponse.classesarray[3]} placeholder="Class Four" />
                            <Form.Control id="class-five" style={{ margin: '8px 0px' }} type="text" defaultValue={surveyResponse.classesarray[4]} placeholder="Class Five" />
                            <Form.Control id="class-six" style={{ margin: '8px 0px' }} type="text" defaultValue={surveyResponse.classesarray[5]} placeholder="Class Six" />
                            <Button variant="primary" disabled={loading} onClick={() => confirmClasses()}>Confirm Classes</Button>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        )
    }

    //setup step: connect cloud service
    if (!userDB.cloudaccess && !code) { 
        return (
            <div>
                <ProgressBar style={{ margin: '60px auto 20px auto', width: '400px', height: '25px'}} now={40} label={`Setup: 40%`} />
                <div style={{ margin: '20px 0px 10px 0px' }} className="d-flex justify-content-center">
                    <Card style={{ width: '400px' }}>
                        <Card.Header as="h5">Connect a cloud service</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                Classes confirmed. Next step: connect a
                                cloud service.
                            </Card.Text>   
                            <Card.Text>
                                Studyflow will watch a specified folder for new file 
                                uploads (uploaded by a note-taking app or scan). Once a 
                                new file is deteced, a new Notion (see next step) page will be created for your note.
                            </Card.Text>  
                            <Card.Text>
                                A human will never view any of your files. Here's our
                                <a href={process.env.REACT_APP_PRIVACY_LINK} target="_blank">privacy policy.</a>
                            </Card.Text>    
                        </Card.Body>
                    </Card>
                </div>
                <div className="d-flex flex-column align-items-center">
                    <a href={onedriveURL}><Button variant="info" style={{margin: '0px 30px 10px', width: '250px'}}><span style={{ color: 'white' }}>Connect OneDrive Account</span></Button></a>
                    <span
                        ref={googleTarget}
                        onMouseEnter={() => setShowGoogleTip(true)}
                        onMouseLeave={() => setShowGoogleTip(false)}
                    >
                        <Button
                            disabled={true} variant="success" style={{ margin: '10px 30px', width: '250px' }}>
                            Connect Google Account
                        </Button>
                    </span>
                    
                    <Overlay target={googleTarget.current} show={showGoogleTip} placement="right">
                        <Tooltip>
                            Google Drive support coming soon.
                        </Tooltip>
                    </Overlay>
                    <span
                        ref={dropboxTarget}
                        onMouseEnter={() => setShowDropboxTip(true)}
                        onMouseLeave={() => setShowDropboxTip(false)}
                    >
                        <Button
                            disabled={true} variant="secondary" style={{ margin: '10px 30px', width: '250px' }}
                            >
                            Connect Dropbox Account
                        </Button>
                    </span>
                    <Overlay target={dropboxTarget.current} show={showDropboxTip} placement="right">
                        <Tooltip>
                            Dropbox support coming soon.
                        </Tooltip>
                    </Overlay>
                </div>
                {!surveyResponse.cloud ? 
                    <FlowDisplay flow={{ tags: ['Pencil', 'OneDrive', 'Notion', 'Todoist'] }} />
                :
                    <span></span>
                }
                {surveyResponse.cloud === 'No' ? 
                    <FlowDisplay flow={{ tags: [surveyResponse.apporcloud, 'OneDrive', 'Notion', 'Todoist'] }} />
                :
                    <span></span>
                }
                {surveyResponse.cloud && surveyResponse.cloud !== 'No' ?
                    <FlowDisplay flow={{ tags: [surveyResponse.apporcloud, surveyResponse.cloud, 'Notion', 'Todoist'] }} />
                :
                    <span></span>
                }
            </div>
            
        )
    }

    //setup step: connect notion account
    if (!userDB.notionaccess && state !== 'notion') { 
        return (
            <div>
                <ProgressBar style={{ margin: '60px auto 20px auto', width: '400px', height: '25px'}} now={60} label={`Setup: 60%`} />
                <div style={{margin: '20px 0px 10px 0px' }} className="d-flex justify-content-center">
                    <Card style={{ width: '400px' }}>
                        <Card.Header as="h5">Connect to Notion</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                Thanks for connecting{'' || ' ' + userDB.cloud}. Next step: connect your
                                Notion Account.
                            </Card.Text>   
                            <Card.Text>
                                Once a {userDB.cloud} file is detected, a Notion page will be
                                created, where you can enter active recall questions and review your note.
                                Don't worry, we'll organize your Notion for you. 
                            </Card.Text>  
                            <Card.Text>
                                {`Again, a human will never view your Notion page. Here's our `}
                                <a href={process.env.REACT_APP_PRIVACY_LINK} target="_blank">privacy policy </a>
                                one more time.
                            </Card.Text>  
                            <Card.Text>
                                <strong>Only allow us to access a single Notion page. We will remove all previous
                                content from this page.</strong>
                            </Card.Text>  
                        </Card.Body>
                    </Card>
                </div>
                <div className="d-flex flex-column align-items-center">
                    <a href={notionURL}><Button variant="dark" style={{margin: '10px 30px', width: '250px'}}>Connect Notion Account</Button></a>
                </div>
                {!surveyResponse.cloud ? 
                    <FlowDisplay flow={{ tags: ['Pencil', 'OneDrive', 'Notion', 'Todoist'] }} />
                :
                    <span></span>
                }
                {surveyResponse.cloud === 'No' ? 
                    <FlowDisplay flow={{ tags: [surveyResponse.apporcloud, 'OneDrive', 'Notion', 'Todoist'] }} />
                :
                    <span></span>
                }
                {surveyResponse.cloud && surveyResponse.cloud !== 'No' ?
                    <FlowDisplay flow={{ tags: [surveyResponse.apporcloud, surveyResponse.cloud, 'Notion', 'Todoist'] }} />
                :
                    <span></span>
                }
            </div>
            
        )
    }

    //setup step: connect todoist account
    if (!userDB.todoistaccess && state !== 'todoist') { 
        return (
            <div>
                <ProgressBar style={{margin: '60px auto 20px auto', width: '400px', height: '25px'}} now={80} label={`Setup: 80%`} />
                <div style={{margin: '20px 0px 10px 0px' }} className="d-flex justify-content-center">
                    <Card style={{ width: '400px' }}>
                        <Card.Header as="h5">Connect to Todoist</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                Thanks for connecting your Notion account. Final step: connect to a
                                task manager.
                            </Card.Text>   
                            <Card.Text>
                                After a Notion page is created for your note, 5 tasks will be created in your task 
                                manager.
                                <ol>
                                    <li>(Day of Note) Create Active Recall Questions</li>
                                    <li>(1 day) Review Note, Answer Questions</li>
                                    <li>(3 days) Review Note, Answer Questions</li>
                                    <li>(7 days) Review Note, Answer Questions</li>
                                    <li>(30 days) Review Note, Answer Questions</li>
                                </ol>
                                Don't worry, we'll create a school project for you, with sections for each class.
                            </Card.Text>  
                            <Card.Text>
                                <strong>Congratulations on setting up Studyflow, {currentUser.displayName}!
                                Look foward to more efficiency and free time!</strong>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
                <div className="d-flex flex-column align-items-center">
                    <a href={todoistURL}><Button variant="danger" style={{ margin: '10px 30px', width: '250px' }}><span style={{ color: 'white' }}>Connect Todoist Account</span></Button></a>
                </div>
                {!surveyResponse.cloud ? 
                    <FlowDisplay flow={{ tags: ['Pencil', 'OneDrive', 'Notion', 'Todoist'] }} />
                :
                    <span></span>
                }
                {surveyResponse.cloud === 'No' ? 
                    <FlowDisplay flow={{ tags: [surveyResponse.apporcloud, 'OneDrive', 'Notion', 'Todoist'] }} />
                :
                    <span></span>
                }
                {surveyResponse.cloud && surveyResponse.cloud !== 'No' ?
                    <FlowDisplay flow={{ tags: [surveyResponse.apporcloud, surveyResponse.cloud, 'Notion', 'Todoist'] }} />
                :
                    <span></span>
                }
            </div>
            
        )
    }
    
    return <Main />
}
