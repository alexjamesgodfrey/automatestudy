import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import ProfileCards from './ProfileCards'
import Class from '../Class/Class'
import Alert from 'react-bootstrap/Alert'
import './Fades.scss'
import "react-toggle/style.css"


export default function Main() {
    const { currentUser, userDB, userFlows, surveyResponse } = useAuth()

    return (
        <div style={{ width: '1000px', margin: '0px auto' }} className='d-flex flex-column justify-content-center'>
            <h4 style={{ textAlign: 'center', margin: '20px' }}>Welcome, <span style={{ textTransform: 'capitalize' }}>{currentUser.displayName}</span> | {surveyResponse.grade} at {surveyResponse.college}</h4>
            <h4>Your Profile</h4>
            {!userDB.stripesubscription ? 
                <Alert style={{ textAlign: 'center' }} variant='danger'>
                    Please <Alert.Link href={process.env.REACT_APP_STRIPE_LINK}>subscribe to Studyflow.ai
                    </Alert.Link> to activate your flows. 14-day free trial available.
                </Alert>
            :
                <span></span>
            }
            <ProfileCards />
            <h4>Your classes</h4>
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
