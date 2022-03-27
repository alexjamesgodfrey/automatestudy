import React, { useState, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Nav from 'react-bootstrap/Nav'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Class from '../Class/Class'
import ProfileCards from './ProfileCards'
import Alert from 'react-bootstrap/Alert'
import './Fades.scss'
import "react-toggle/style.css"


export default function Main() {
    const { currentUser, userDB, userFlows, surveyResponse } = useAuth()

    const [showClassModal, setShowClassModal] = useState(false)
    const [adding, setAdding] = useState(true)
    const newClassName = useRef()
    const [loading, setLoading] = useState(false)

    console.log(userDB)

    const addClass = async () => {
        setLoading(true)
        const newClass = newClassName.current.value
        const cs = userDB.classes
        cs.push(newClass)
        console.log(cs)
        //add class to database
        await fetch(`/api/users/classes/${currentUser.uid}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cs: cs.toString()
            })
        })
        //create flow
        .then(async () => {
            const json = `{
                "active": false,
                "c": "${newClass}"
            }`
            await fetch(`/api/flows/create/${userDB.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: json
            })
        })
        //add class to notion
        .then(async () => {
            await fetch(`/api/notion/createclass/${userDB.id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    class_name: newClass
                })
            })
        })
        //add section to todoist
        .then(async () => {
            await fetch(`/api/todoist/addsection/${userDB.id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    class_name: newClass,
                    access_token: userDB.todoistaccess
                })
            })
        })
        //refresh page
        .then(() => window.location.reload(true))
    }

    console.log(currentUser.metadata)

    return (
        <div style={{ width: '1000px', margin: '20px auto' }} className='d-flex flex-column justify-content-center'>
            
            <h4 style={{ textAlign: 'center', margin: '20px' }}>Welcome, <span style={{ textTransform: 'capitalize' }}>{currentUser.displayName}</span> | {surveyResponse.grade} at {surveyResponse.college}</h4>
            {!userDB.stripesubscription ? 
                <Alert style={{ textAlign: 'center' }} variant='danger'>
                    Please <Alert.Link href={process.env.REACT_APP_STRIPE_LINK}>subscribe to Studyflow.ai
                    </Alert.Link> to activate your flows. If you can't afford it, it's free.
                </Alert>
            :
                <span></span>
            }
            <ProfileCards />
            <Modal onHide={() => setShowClassModal(false)} show={showClassModal}>
                <Modal.Header closeButton>
                    <Nav variant="tabs" defaultActiveKey="add">
                        <Nav.Item onClick={() => setAdding(true)}>
                            <Nav.Link eventKey="add">Add a Class</Nav.Link>
                        </Nav.Item>
                        <Nav.Item onClick={() => setAdding(false)}>
                            <Nav.Link eventKey="delete">Delete a Class</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Modal.Header>
                <Modal.Body>
                    {adding ? 
                        <div>
                            <span>Your classes: </span>
                            {userDB.classes.map((c, i) => {
                                return <span>{c + ' '}</span>
                            })}
                            <p>
                                Studyflow users can have <strong>six </strong>
                                classes at once. You can add <strong>
                                {6 - userDB.classes.length} </strong>
                                more classes below.
                            </p>
                            <p>
                                After adding a class, a new Todoist project section will be 
                                created, along with a new Notion page. 
                            </p>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Class Name</Form.Label>
                                    <Form.Control ref={newClassName} placeholder="Enter Class Name Here" />
                                    <Form.Text className="text-muted">
                                        Enter class code or name
                                    </Form.Text>
                                </Form.Group>
                                <Button onClick={() => addClass()} disabled={loading} variant="primary" type="submit">
                                    Add class
                                </Button>
                            </Form>
                        </div>
                    :
                        <div>
                            Delete functionality coming soon.
                        </div>
                    }
                </Modal.Body>
            </Modal>
            <h4>Your classes 
                <span
                    onClick={() => setShowClassModal(!showClassModal)}
                    style={{ cursor: 'pointer' }}>
                    {` +/-`}
                </span>
            </h4>
            <div className="d-flex flex-wrap justify-content-center"> 
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
