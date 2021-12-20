import React, { useState, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Checkmark } from 'react-checkmark'
import Toggle from 'react-toggle'
import Card from 'react-bootstrap/Card'
import Overlay from 'react-bootstrap/Overlay'
import Tooltip from 'react-bootstrap/Tooltip'
import './ProfileCards.scss'

export default function ProfileCards() {
    const { currentUser, userDB } = useAuth()
    const primaryColor = '#84cacc'
    const [showPublicAccountTip, setShowPublicAccountTip] = useState(false)
    const publicAccountTarget = useRef(null)

    console.log(currentUser.uid)

    return (
        <div style={{ margin: '20px 0px' }} className="d-flex justify-content-center"> 
            <Card style={{ margin: '0px 20px' }}>
                <Card.Header as="h5" style={{ width: '250px' }}>{currentUser.displayName}</Card.Header>
                <Card.Text>
                    Cloud service: {userDB.cloud}
                </Card.Text>
            </Card>
            <Card style={{ margin: '0px 20px'}}>
                <Card.Header as="h5" style={{ width: '250px' }}>Connections</Card.Header>
                <Card.Text style={{ margin: '5px 10px 0px 10px' }} className="d-flex align-items-center">
                    <span style={{ width: '180px'}}>Cloud service: {userDB.cloud}</span>
                    <Checkmark size="small" color={primaryColor} />
                </Card.Text>
                <Card.Text style={{ margin: '0px 10px'}} className="d-flex align-items-center">
                    <span style={{ width: '180px'}}>Notion Connected</span>
                    <Checkmark size="small" color={primaryColor} />
                </Card.Text>
                {userDB.todoistaccess ? 
                    <Card.Text style={{ margin: '0px 10px'}} className="d-flex align-items-center">
                        <span style={{ width: '180px'}}>Todoist Connected</span>
                        <Checkmark size="small" color={primaryColor} />
                    </Card.Text>
                :
                    <span></span>
                }
            </Card>
            <Card style={{ margin: '0px 20px' }}>
                <Card.Header as="h5" style={{ width: '250px' }}>Settings</Card.Header>
                <Card.Text style={{ margin: '5px 10px' }} className="d-flex align-items-center">
                    <span 
                        style={{ width: '160px' }}
                        ref={publicAccountTarget}
                        onMouseEnter={() => setShowPublicAccountTip(true)}
                        onMouseLeave={() => setShowPublicAccountTip(false)}
                    >Public Account </span>
                    <Overlay target={publicAccountTarget.current} show={showPublicAccountTip} placement="bottom">
                        <Tooltip id="overlay-example">
                            If enabled, users in the Studyflow community will be able to view your username,
                            notes, and classes.
                        </Tooltip>
                    </Overlay>
                    <Toggle
                        className='custom-colors'
                        defaultChecked={false}
                        // onChange={this.handleCheeseChange} 
                    />
                    
                </Card.Text>
            </Card>
        </div>
    )
}
