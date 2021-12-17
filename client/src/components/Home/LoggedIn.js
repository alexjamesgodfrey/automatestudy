import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useLocation } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Survey from './Survey'
import Main from './Main'

export default function LoggedIn() {
    const { currentUser, userDB, surveyResponse } = useAuth()
    const [takenSurvey, setTakenSurvey] = useState(surveyResponse)

    const search = useLocation().search
    const code = new URLSearchParams(search).get('code');
    const state = new URLSearchParams(search).get('state');
    const redirectURI = 'http%3A%2F%2Flocalhost%3A3000'

    /**
     * Checks for onedrive code presence in url and adds if present
     */
     const onedriveClient = process.env.REACT_APP_ONEDRIVE_CLIENT
     const onedriveState = 'onedrive'
     const onedriveURL = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${onedriveClient}&response_type=code&redirect_uri=${redirectURI}&response_mode=query&scope=files.read.all%20user.read&state=${onedriveState}`
     const [tempOneDrive, setTempOneDrive] = useState(false)
     const checkOnedrive = async () => {
         if (code && state === onedriveState){
             setTempOneDrive(true)
             console.log('OneDrive not found, OneDrive code present')
             await fetch(`/api/users/onedrivecode/${code}/${currentUser.uid}`, {
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
    }, [])

    return (
        <div>
            {takenSurvey && userDB.cloudcode ? 
                <Main />
                :
                <span></span>
            }  
            {!takenSurvey && !userDB.cloudcode ? 
                <div>
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
            :
                <span></span>
            }
            {takenSurvey && (!userDB.cloudcode || tempOneDrive) ? 
                <div>
                    <div style={{margin: '20px 20px' }} className="d-flex justify-content-center">
                        <Card style={{ width: '300px', margin: '15px' }}>
                            <Card.Header as="h5">Connect cloud service</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    Your survey results have been recorded. One more step: connect a
                                    cloud service.
                                </Card.Text>   
                                <Card.Text>
                                    Studyflow will watch a specified folder for new file 
                                    uploads (uploaded by a note-taking app or scan). Once a 
                                    new file is deteced, a new Studyflow entry will be created.
                                </Card.Text>  
                                <Card.Text>
                                    A human will never view any of your files. View our privacy
                                    policy for details. 
                                </Card.Text>    
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="d-flex flex-column align-items-center">
                        <a href={onedriveURL}><Button variant="info" style={{margin: '0px 30px 10px', width: '250px'}}>Connect OneDrive Account</Button></a>
                        <a><Button variant="warning" style={{margin: '10px 30px', width: '250px'}}>Connect Google Drive Account</Button></a>
                        <a><Button variant="secondary" style={{margin: '10px 30px', width: '250px'}}>Connect Dropbox Account</Button></a>
                    </div>
                    
                </div>
            :
                <span></span>
            }
            
        </div>
        
    )
}
