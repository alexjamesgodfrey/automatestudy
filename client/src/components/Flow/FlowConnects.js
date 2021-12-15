import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import './FlowConnects.scss'

export default function FlowConnects(props) {
    const search = useLocation().search
    const code = new URLSearchParams(search).get('code');
    const state = new URLSearchParams(search).get('state');
    const redirectURI = 'http%3A%2F%2Flocalhost%3A3000'

    

    const todoistClient = process.env.REACT_APP_TODOIST_CLIENT
    const todoistSecret = process.env.REACT_APP_TODOIST_SECRET
    const todoistURL = `https://todoist.com/oauth/authorize?client_id=${todoistClient}&scope=data:read_write,data:delete&state=${todoistSecret}`

    /**
     * Checks for onedrive code presence in url and adds if present
     */
    const onedriveClient = process.env.REACT_APP_ONEDRIVE_CLIENT
    const onedriveState = 'onedrive'
    const onedriveURL = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${onedriveClient}&response_type=code&redirect_uri=${redirectURI}&response_mode=query&scope=files.read.all%20user.read&state=${onedriveState}`
    const [tempOneDrive, setTempOneDrive] = useState(false)
    const checkOnedrive = async () => {
        if (!props.userDB.onedrivecode && code && state === onedriveState){
            setTempOneDrive(true)
            console.log('OneDrive not found, OneDrive code present')
            await fetch(`/api/users/onedrivecode/${code}/${props.currentUser.uid}`, {
                method: 'PUT'
            })
        }
    }

    /**
     * Checks for dropbox code presence in url and adds if present
     */
    const dropboxClient = process.env.REACT_APP_DROPBOX_CLIENT
    const dropboxState = 'dropbox'
    const dropboxURL = `https://www.dropbox.com/oauth2/authorize?client_id=${dropboxClient}&response_type=code&redirect_uri=${redirectURI}&state=${dropboxState}`
    const [tempDropbox, setTempDropbox] = useState(false)
    const checkDropbox = async () => {
        if (!props.userDB.dropboxcode){
            console.log('Dropbox not found')
            if (code && state === dropboxState){
                setTempDropbox(true)
                console.log('adding dropboxcode to user')
                await fetch(`/api/users/dropboxcode/${code}/${props.currentUser.uid}`, {
                    method: 'PUT'
                })
            }
        }
    }

    /**
     * Checks for notion code presence in url and adds if present
     */
    const notionClient = process.env.REACT_APP_NOTION_CLIENT
    const notionState = process.env.REACT_APP_NOTION_SECRET
    const notionURL = `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=${notionClient}&redirect_uri=${redirectURI}&response_type=code&state=${notionState}`
    const [tempNotion, setTempNotion] = useState(false)
    const checkNotion = async () => {
        if (!props.userDB.notioncode && code && state === notionState){
            console.log('Notion not found, notionurlcode present')
            setTempNotion(true)
            await fetch(`/api/users/notioncode/${code}/${props.currentUser.uid}`, {
                method: 'PUT'
            })
        }
    }

    useEffect(() => {
        checkOnedrive()
        checkDropbox()
        checkNotion()
    }, [])

    if (!props.connected) {
        return (
            <div className="d-flex justify-content-center flex-column align-items-left">
                <ol>
                {props.needs.indexOf('OneDrive') !== -1 && !tempOneDrive ?
                    <li className="d-flex justify-content-left align-items-center">
                        <a className="d-flex justify-content-between" style={{ textDecoration: 'none'}} href={onedriveURL}>
                            <span style={{ color: '#CB444A', marginRight: '10px', marginTop: '5px' }}>Connect OneDrive Account</span>
                            <Button style={{  marginTop: '2px' }} size ="sm" variant="danger">go</Button>
                        </a>
                    </li>
                : 
                    <span></span>
                }
                {props.flow.indexOf('OneDrive') !== -1 && (props.userDB.onedrivecode || tempOneDrive) ?
                    <li className="d-flex justify-content-left align-items-center" style={{color: '#69B354'}}>
                        <span style={{height: '40px', color: '#4BB543', textDecoration: 'line-through' }}>Connect OneDrive Account</span>
                    </li>
                : 
                    <span></span>
                }

                {props.needs.indexOf('Dropbox') !== -1 && !tempDropbox ?
                    <li className="d-flex justify-content-left align-items-center" className="d-flex justify-content-left align-items-center">
                        <a className="d-flex justify-content-between" style={{ textDecoration: 'none'}} href={dropboxURL}>
                            <span style={{ color: '#CB444A', marginRight: '10px', marginTop: '5px' }}>Connect Dropbox Account</span>
                            <Button style={{  marginTop: '2px' }} size ="sm" variant="danger">go</Button>
                        </a>
                    </li>
                : 
                    <span></span>
                }
                {props.flow.indexOf('Dropbox') !== -1 && (props.userDB.dropboxcode || tempDropbox) ?
                    <li className="d-flex justify-content-left align-items-center" style={{color: '#69B354'}}>
                        <span style={{height: '40px', color: '#4BB543', textDecoration: 'line-through' }}>Connect Dropbox Account</span>
                    </li>
                : 
                    <span></span>
                }

                {props.needs.indexOf('Notion') !== -1 && !tempNotion ?
                    <li className="d-flex justify-content-left align-items-center">
                        <a className="d-flex justify-content-between" style={{ textDecoration: 'none'}} href={notionURL}>
                            <span style={{ color: '#CB444A', marginRight: '10px', marginTop: '5px' }}>Connect Notion Account</span>
                            <Button style={{  marginTop: '2px' }} size ="sm" variant="danger">go</Button>
                        </a>
                    </li>
                    
                : 
                    <span></span>
                }
                {props.flow.indexOf('Notion') !== -1 && (props.userDB.notioncode || tempNotion) ?
                    <li className="d-flex justify-content-left align-items-center" style={{color: '#69B354'}}>
                        <span style={{height: '40px', color: '#4BB543', textDecoration: 'line-through' }}>Connect Notion Account</span>
                    </li>
                : 
                    <span></span>
                }
                {/* {props.flow.indexOf('Todoist') !== -1 && !props.userDB.todoistcode ?
                    <div style={{margin: '5px'}} className="d-flex justify-content-left align-items-center">
                        <div style={{ width: '6px', height: '6px', backgroundColor: '#CB444A', borderRadius: '50%', margin: '0px 3px 2.5px 0px'}}></div>
                        <a style={{ textDecoration: 'none'}} href={todoistURL}>
                            <span style={{ color: '#CB444A', marginRight: '10px' }}>Connect Todoist Account</span>
                            <Button size ="sm" variant="danger">go</Button>
                        </a>
                    </div>
                : 
                    <span></span>
                }
                {props.flow.indexOf('Todoist') !== -1 && props.userDB.todoistcode ?
                    <div style={{margin: '5px'}} className="d-flex justify-content-left align-items-center">
                        <div style={{ width: '6px', height: '6px', backgroundColor: '#4BB543', borderRadius: '50%', margin: '0px 3px 3px 0px'}}></div>
                            <span style={{ color: '#4BB543', textDecoration: 'line-through', marginTop: '11px'}}>Connect Todoist Account</span>
                    </div>
                : 
                    <span></span>
                } */}
                </ol>
            </div>
        )
    }
   
}
