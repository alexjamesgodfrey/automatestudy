import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

export default function Main() {
    const { currentUser, userDB, surveyResponse } = useAuth()
    const search = useLocation().search
    const todoistClient = process.env.REACT_APP_TODOIST_CLIENT
    const todoistSecret = process.env.REACT_APP_TODOIST_SECRET
    const todoistURL = `https://todoist.com/oauth/authorize?client_id=${todoistClient}&scope=data:read_write,data:delete&state=${todoistSecret}`
    const notionClient = process.env.REACT_APP_NOTION_CLIENT
    const notionState = process.env.REACT_APP_NOTION_SECRET
    const notionURL = `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=${notionClient}&redirect_uri=http%3A%2F%2Flocalhost%3A3001&response_type=code&state=${notionState}`
    const onedriveClient = process.env.REACT_APP_ONEDRIVE_CLIENT
    const onedriveState = 'onedrive'
    const onedriveURL = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${onedriveClient}&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3001&response_mode=query&scope=offline_access%20user.read%20mail.read&state=${onedriveState}`

    const checkTodoist = async () => {
        if (!userDB.todoistCode){
            const code = new URLSearchParams(search).get('code');
            const state = new URLSearchParams(search).get('state');
            if (code && state === todoistSecret){
                console.log('adding todoistcode to user')
                await fetch(`/api/users/todoistcode/${code}/${currentUser.uid}`, {
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


    

    useEffect(() => {
        checkTodoist()
        checkNotion()
        checkOnedrive()
    })

    return (
        <div>
            <h4 style={{margin: '20px'}}>{currentUser.displayName} | {surveyResponse.grade} at {surveyResponse.college}</h4>
            <div style={{margin: '20px 20px' }} className="d-flex justify-content-center">
                <Card style={{ width: '300px', margin: '15px' }}>
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
                            {userDB.onedrivecode ?
                                <span style={{color: '#4BB543', textDecoration: 'line-through'}}>2. Connect OneDrive Account</span>
                                :
                                <div className="d-flex justify-content-between align-items-center"><span>2. Connect OneDrive Account</span><a href={onedriveURL}><Button variant="info">go</Button></a></div>
                            }       
                        </Card.Text>    
                        <Card.Text>
                            {userDB.notioncode ?
                                <span style={{color: '#4BB543', textDecoration: 'line-through'}}>3. Connect Notion Account</span>
                                :
                                <div className="d-flex justify-content-between align-items-center"><span>3. Connect Notion Account</span><a href={notionURL}><Button variant="dark">go</Button></a></div>
                            }       
                        </Card.Text>    
                    </Card.Body>
                </Card>
            </div>
            <Card style={{ width: '300px' }}>
                <Card.Header as="h5">Your Classes</Card.Header>
                <Card.Body>
                    <Card.Text>
                        {surveyResponse.classesarray.map((c, i) => {
                            return <p>{c}</p>
                        })}
                    </Card.Text>    
                </Card.Body>
            </Card>
        </div>
    )
}
