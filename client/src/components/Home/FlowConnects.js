import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Button from 'react-bootstrap/Button'

export default function FlowConnects(props) {
    const search = useLocation().search
    const code = new URLSearchParams(search).get('code');
    const state = new URLSearchParams(search).get('state');
    const redirectURI = 'http%3A%2F%2Flocalhost%3A3000'

    const todoistClient = process.env.REACT_APP_TODOIST_CLIENT
    const todoistSecret = process.env.REACT_APP_TODOIST_SECRET
    const todoistURL = `https://todoist.com/oauth/authorize?client_id=${todoistClient}&scope=data:read_write,data:delete&state=${todoistSecret}`
    const notionClient = process.env.REACT_APP_NOTION_CLIENT
    const notionState = process.env.REACT_APP_NOTION_SECRET
    const notionURL = `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=${notionClient}&redirect_uri=${redirectURI}&response_type=code&state=${notionState}`
    const [tempNotion, setTempNotion] = useState(false)
    const onedriveClient = process.env.REACT_APP_ONEDRIVE_CLIENT
    const onedriveState = 'onedrive'
    const onedriveURL = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${onedriveClient}&response_type=code&redirect_uri=${redirectURI}&response_mode=query&scope=files.read.all%20user.read&state=${onedriveState}`
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
        checkDropbox()
        checkNotion()
    }, [])

    return (
        <div className="d-flex justify-content-center flex-column align-items-left">
            {props.flow.tags.indexOf('OneDrive') !== -1 && !props.userDB.onedrivecode ?
                <div style={{margin: '5px'}} className="d-flex justify-content-left align-items-center">
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#CB444A', borderRadius: '50%', margin: '0px 3px 2.5px 0px'}}></div>
                    <a className="d-flex justify-content-between" style={{ textDecoration: 'none'}} href={onedriveURL}>
                        <span style={{ color: '#CB444A', marginRight: '10px' }}>Connect OneDrive Account</span>
                        <Button size ="sm" variant="danger">go</Button>
                    </a>
                </div>
            : 
                <span></span>
            }
            {props.flow.tags.indexOf('OneDrive') !== -1 && props.userDB.onedrivecode ?
                <div style={{margin: '5px'}} className="d-flex justify-content-left align-items-center">
                    <span style={{height: '40px', color: '#4BB543', textDecoration: 'line-through' }}>Connect OneDrive Account</span>
                </div>
            : 
                <span></span>
            }

            {props.flow.tags.indexOf('Dropbox') !== -1 && !props.userDB.dropboxcode && !tempDropbox ?
                <div style={{margin: '5px'}} className="d-flex justify-content-left align-items-center">
                    <a className="d-flex justify-content-between" style={{ textDecoration: 'none', width: '275px' }} href={dropboxURL}>
                        <span style={{ color: '#CB444A', marginRight: '10px' }}>Connect Dropbox Account</span>
                        <Button size ="sm" variant="danger">go</Button>
                    </a>
                </div>
            : 
                <span></span>
            }
            {props.flow.tags.indexOf('Dropbox') !== -1 && (props.userDB.dropboxcode || tempDropbox) ?
                <div style={{margin: '5px'}} className="d-flex justify-content-left align-items-center">
                        <span style={{ color: '#4BB543', textDecoration: 'line-through' }}>Connect Dropbox Account</span>
                </div>
            : 
                <span></span>
            }

            {props.flow.tags.indexOf('Notion') !== -1 && !props.userDB.notioncode && !tempNotion ?
                <div style={{margin: '5px'}} className="d-flex justify-content-left align-items-center">
                    <a className="d-flex justify-content-between" style={{ textDecoration: 'none', width: '275px' }} href={notionURL}>
                        <span style={{ color: '#CB444A', marginRight: '10px', width: '300px' }}>Connect Notion Account</span>
                        <Button size ="sm" variant="danger">go</Button>
                    </a>
                </div>
            : 
                <span></span>
            }
            {props.flow.tags.indexOf('Notion') !== -1 && (props.userDB.notioncode || tempNotion) ?
                <div style={{margin: '5px'}} className="d-flex justify-content-left align-items-center">
                    <span style={{color: '#4BB543', textDecoration: 'line-through', width: '300px'}}>Connect Notion Account</span>
                </div>
            : 
                <span></span>
            }
            {props.flow.tags.indexOf('Todoist') !== -1 && !props.userDB.todoistcode ?
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
            {props.flow.tags.indexOf('Todoist') !== -1 && props.userDB.todoistcode ?
                <div style={{margin: '5px'}} className="d-flex justify-content-left align-items-center">
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#4BB543', borderRadius: '50%', margin: '0px 3px 3px 0px'}}></div>
                        <span style={{ color: '#4BB543', textDecoration: 'line-through', marginTop: '11px'}}>Connect Todoist Account</span>
                </div>
            : 
                <span></span>
            }
        </div>
    )
}
