import React from 'react'
import Button from 'react-bootstrap/Button'

export default function FlowConnects(props) {
    const todoistClient = process.env.REACT_APP_TODOIST_CLIENT
    const todoistSecret = process.env.REACT_APP_TODOIST_SECRET
    const todoistURL = `https://todoist.com/oauth/authorize?client_id=${todoistClient}&scope=data:read_write,data:delete&state=${todoistSecret}`
    const notionClient = process.env.REACT_APP_NOTION_CLIENT
    const notionState = process.env.REACT_APP_NOTION_SECRET
    const notionURL = `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=${notionClient}&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&state=${notionState}`
    const onedriveClient = process.env.REACT_APP_ONEDRIVE_CLIENT
    const onedriveState = 'onedrive'
    const onedriveURL = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${onedriveClient}&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_mode=query&scope=files.read.all%20user.read&state=${onedriveState}`

    return (
        <div className="d-flex justify-content-center flex-wrap align-items-center">
            {props.flow.tags.indexOf('OneDrive') !== -1 && !props.userDB.onedrivecode ?
                <div style={{margin: '5px'}} className="d-flex justify-content-left align-items-center">
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#CB444A', borderRadius: '50%', margin: '0px 3px 2.5px 0px'}}></div>
                    <a style={{ textDecoration: 'none'}} href={onedriveURL}>
                        <span style={{ color: '#CB444A', marginRight: '10px' }}>Connect OneDrive Account</span>
                        <Button variant="danger">go</Button>
                    </a>
                </div>
            : 
                <span></span>
            }
            {props.flow.tags.indexOf('OneDrive') !== -1 && props.userDB.onedrivecode ?
                <div style={{margin: '5px'}} className="d-flex justify-content-left align-items-center">
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#4BB543', borderRadius: '50%', margin: '0px 3px 3px 0px'}}></div>
                        <span style={{height: '40px', color: '#4BB543', textDecoration: 'line-through', marginTop: '11px'}}>Connect OneDrive Account</span>
                </div>
            : 
                <span></span>
            }
            {props.flow.tags.indexOf('Notion') !== -1 && !props.userDB.notioncode ?
                <div style={{margin: '5px'}} className="d-flex justify-content-left align-items-center">
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#CB444A', borderRadius: '50%', margin: '0px 3px 2.5px 0px'}}></div>
                    <a style={{ textDecoration: 'none'}} href={notionURL}>
                        <span style={{ color: '#CB444A', marginRight: '10px' }}>Connect Notion Account</span>
                        <Button variant="danger">go</Button>
                    </a>
                </div>
            : 
                <span></span>
            }
            {props.flow.tags.indexOf('Notion') !== -1 && props.userDB.notioncode ?
                <div style={{margin: '5px'}} className="d-flex justify-content-left align-items-center">
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#4BB543', borderRadius: '50%', margin: '0px 3px 3px 0px'}}></div>
                        <span style={{height: '40px', color: '#4BB543', textDecoration: 'line-through', marginTop: '11px'}}>Connect Notion Account</span>
                </div>
            : 
                <span></span>
            }
            {props.flow.tags.indexOf('Todoist') !== -1 && !props.userDB.todoistcode ?
                <div style={{margin: '5px'}} className="d-flex justify-content-left align-items-center">
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#CB444A', borderRadius: '50%', margin: '0px 3px 2.5px 0px'}}></div>
                    <a style={{ textDecoration: 'none'}} href={todoistURL}>
                        <span style={{ color: '#CB444A', marginRight: '10px' }}>Connect Todoist Account</span>
                        <Button variant="danger">go</Button>
                    </a>
                </div>
            : 
                <span></span>
            }
            {props.flow.tags.indexOf('Todoist') !== -1 && props.userDB.todoistcode ?
                <div style={{margin: '5px'}} className="d-flex justify-content-left align-items-center">
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#4BB543', borderRadius: '50%', margin: '0px 3px 3px 0px'}}></div>
                        <span style={{height: '40px', color: '#4BB543', textDecoration: 'line-through', marginTop: '11px'}}>Connect Todoist Account</span>
                </div>
            : 
                <span></span>
            }
        </div>
    )
}
