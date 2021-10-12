import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Card from 'react-bootstrap/Card'
import Survey from './Survey'

export default function LoggedIn() {
    const { currentUser, logout } = useAuth()

    return (
        <div>
            <div style={{margin: '20px 20px' }} className="d-flex justify-content-center">
                <Card style={{ width: '300px', margin: '15px' }}>
                    <Card.Header as="h5">Welcome, {currentUser.displayName}</Card.Header>
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
