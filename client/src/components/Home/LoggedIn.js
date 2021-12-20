import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useLocation } from 'react-router-dom'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Survey from './Survey'
import Main from './Main'
import FlowDisplay from '../Flow/FlowDisplay'

export default function LoggedIn() {
    const { currentUser, userDB, surveyResponse } = useAuth()
    const [takenSurvey, setTakenSurvey] = useState(surveyResponse)

    const search = useLocation().search
    const code = new URLSearchParams(search).get('code');
    const state = new URLSearchParams(search).get('state');

    /**
     * Checks for onedrive code presence in url and adds if present
     */
     const onedriveURL = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${process.env.REACT_APP_ONEDRIVE_CLIENT}&response_type=code&redirect_uri=${process.env.REACT_APP_REDIRECT_URI_URL}&response_mode=query&scope=offline_access%20files.read&state=onedrive`
     const checkOnedrive = async () => {
        if (code && state === 'onedrive') {
            await fetch(`/api/users/initializeonedrive/${code}/${currentUser.uid}`, {
                method: 'PUT'
            })
        }
     }

    const createUser = async () => {
        try {
            const here = await fetch(`/api/users/${currentUser.uid}`)
            const hereJSON = await here.json()
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
    }, [])

    //if setup is complete
    if (takenSurvey && userDB.cloudaccess) {
        return <Main />
    }

    //setup step: take survey
    if (!takenSurvey) {
        return (
            <div>
                <ProgressBar style={{marginTop: '20px', width: '400px', height: '25px'}} now={10} label={`Setup: 10%`} />
                <div style={{margin: '20px 20px' }} className="d-flex justify-content-center">
                    <Card style={{ width: '300px', margin: '15px' }}>
                        <Card.Header as="h5">Welcome to Studyflow</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                Thanks for signing up. Take the getting started survey to begin.
                            </Card.Text>    
                        </Card.Body>
                    </Card>
                </div>
                <div className="d-flex justify-content-center"><Survey /></div>
            </div>
        )
    }

    //setup step: connect cloud service
    if (!userDB.cloudaccess && !code) { 
        return (
            <div>
                <ProgressBar style={{marginTop: '20px', width: '400px', height: '25px'}} now={30} label={`Setup: 30%`} />
                <div style={{margin: '20px 20px' }} className="d-flex justify-content-center">
                    <Card style={{ width: '300px' }}>
                        <Card.Header as="h5">Connect a cloud service</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                Your survey results have been recorded. Next step: connect a
                                cloud service.
                            </Card.Text>   
                            <Card.Text>
                                Studyflow will watch a specified folder for new file 
                                uploads (uploaded by a note-taking app or scan). Once a 
                                new file is deteced, a new Studyflow entry will be created.
                            </Card.Text>  
                            <Card.Text>
                                A human will never view any of your files. Here's our privacy policy
                            </Card.Text>    
                        </Card.Body>
                    </Card>
                </div>
                <div className="d-flex flex-column align-items-center">
                    <a href={onedriveURL}><Button variant="info" style={{margin: '0px 30px 10px', width: '250px'}}>Connect OneDrive Account</Button></a>
                    <a><Button variant="warning" style={{margin: '10px 30px', width: '250px'}}>Connect Google Drive Account</Button></a>
                    <a><Button variant="secondary" style={{margin: '10px 30px', width: '250px'}}>Connect Dropbox Account</Button></a>
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
