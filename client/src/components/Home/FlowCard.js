import React, { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
import FlowDisplay from './FlowDisplay'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

export default function FlowCard(props) {
    const [flow, setFlow] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(true)
 
    const getFlow = async (id) => {
        await fetch(`/api/flowbyid/${id}`)
            .then(response => response.json())
            .then(data => {
                setFlow(data)
                console.log(data)
            })
            .then(() => setLoading(false))
    }

    const changeFlow = async (id) => {
        let userFlows = props.userDB.flows
        userFlows.splice(props.classKey, 1, id)
        const bod = `{
            "flows": [${userFlows}],
            "uid": "${props.currentUser.uid}"
        }`
        await fetch('/api/users/flows/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: bod
        })
        .then(() => {
            getFlow(id)
        })
        .then(() => {
            setShowModal(false)
            setLoading(false)
        })
    }

    useEffect(() => {
        getFlow(props.flowid)
    }, [])


    return (
        <div>
            <Card style={{ marginBottom: '20px', maxWidth: '1000px' }}>
                <Card.Header as="h5">{props.c}</Card.Header>
                {flow.id ?
                <Card.Body>
                    {loading ? 
                        <div style={{marginTop: '100px', height: '150px'}} className="d-flex justify-content-around">
                            <Spinner animation="border" />
                            <Spinner animation="border" />
                            <Spinner animation="border" />
                        </div>
                    :
                    <div>
                        <h6 style={{ borderBottom: '2px solid lightgrey'}}>Tasks</h6>
                        <h6 onClick={() => {
                            setShowModal(true)
                            setLoading(true)}}
                        >Flow Info <span style={{ textDecoration: 'underline', color: '#84CACC', cursor: 'pointer'}}>change</span></h6>
                        <FlowDisplay flow={flow} />
                    </div>
                    }
                </Card.Body>
                :
                <div style={{marginTop: '20px'}} className="d-flex justify-content-center">
                    <Spinner animation="border" />
                </div>
                }
            </Card>
            <Modal show={showModal} onHide={() => {
                    setShowModal(false)
                    setLoading(false)
                }}>
                <Modal.Header closeButton>
                <Modal.Title>Change studyflow for {props.c}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Choose a studyflow based on class difficulty (Easy/Average/Hard) and desired repetition count. </p>
                    {props.flowList.map((flow, key) => {
                        return (
                        <div 
                            onClick={() => changeFlow(flow.id)}
                            style={{ border: '2px solid lightgrey', padding: '10px', margin: '20px 0px', borderRadius: '1%', cursor: 'pointer'}}
                        >
                            <FlowDisplay showDifficulty={true} flow={flow} />
                        </div>)
                    })}
                    {/* <Flows classIndex={currentClassKey} user={userDB} surveyResponse={surveyResponse} class={currentClass} flowList={flowList}/> */}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>  
              
        </div>
            
    )
}
