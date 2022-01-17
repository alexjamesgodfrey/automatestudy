import React, { useState, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import ProfileCards from './ProfileCards'
import Overlay from 'react-bootstrap/Overlay'
import Tooltip from 'react-bootstrap/Tooltip'
import Class from '../Class/Class'
import Alert from 'react-bootstrap/Alert'
import './Fades.scss'
import "react-toggle/style.css"


export default function Main() {
    const { currentUser, userDB, userFlows, surveyResponse } = useAuth()

    const classTarget = useRef()
    const [showClassTip, setShowClassTip] = useState(false)

    return (
        <div style={{ width: '1000px', margin: '20px auto' }} className='d-flex flex-column justify-content-center'>
            <h4 style={{ textAlign: 'center', margin: '20px' }}>Welcome, <span style={{ textTransform: 'capitalize' }}>{currentUser.displayName}</span> | {surveyResponse.grade} at {surveyResponse.college}</h4>
            <h4>Your Profile</h4>
            {!userDB.stripesubscription ? 
                <Alert style={{ textAlign: 'center' }} variant='danger'>
                    Please <Alert.Link href={process.env.REACT_APP_STRIPE_LINK}>subscribe to Studyflow.ai
                    </Alert.Link> to activate your flows. If you can't afford it, it's free.
                </Alert>
            :
                <span></span>
            }
            <ProfileCards />
            <Overlay target={classTarget.current} show={showClassTip} placement="right">
                <Tooltip>
                    You will be able to add and delete classes soon. 
                </Tooltip>
            </Overlay>
            <h4>Your classes 
                <span
                    ref={classTarget}
                    onMouseEnter={() => setShowClassTip(true)}
                    onMouseLeave={() => setShowClassTip(false)}
                    style={{ cursor: 'pointer' }}>
                    {` +/-`}
                </span>
            </h4>
            <div className="d-flex flex-column justify-content-center"> 
                {userDB.classes.map((c, i) => {
                    return <Class
                        class={userFlows[c].class}
                        id={userFlows[c].id}
                        active={userFlows[c].active} 
                        path={userFlows[c].path}
                    />
                })}
            </div>
        </div>
    )
}
