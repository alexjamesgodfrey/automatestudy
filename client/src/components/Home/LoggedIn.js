import React, { useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Card from 'react-bootstrap/Card'
import Survey from './Survey'

export default function LoggedIn() {
    const { currentUser, logout } = useAuth()

    console.log(currentUser)

    const createUser = async () => {
        const here = await fetch(`/api/users/${currentUser.uid}`)
        const hereJSON = await here.json()
        if (hereJSON.length === 0) {
            const user = `{
                "displayname": "${currentUser.displayName}",
                "email": "${currentUser.email}",
                "photourl": "${currentUser.photoURL}",
                "uid": "${currentUser.uid}"
            }`
            console.log('adding user to database')
            await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: user
            })
        }
        
    }

    useEffect(() => {
        createUser()
    })

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
