import React, { useState, useEffect } from 'react'
import FlowConnects from './FlowConnects'
import Card from 'react-bootstrap/Card'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Spinner from 'react-bootstrap/Spinner'
import FlowDisplay from './FlowDisplay'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

export default function FlowCard(props) {
    const [flow, setFlow] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(true)

    const [customFlow, setCustomFlow] = useState([])
    const [media, setMedia] = useState("Media")
    const [cloud, setCloud] = useState("Cloud Service")
    const [difficulty, setDifficulty] = useState('Difficulty')
        
 
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

    const filterFlows = (filters, difficulty) => {
        let tempFlows = props.flowObject
        for (let i=0; i<filters.length; i++) {
            tempFlows = tempFlows[filters[i]]
        }
        const tempFlowArr = Object.entries(tempFlows)
        let flowArr = []
        for (let i=0; i<tempFlowArr.length; i++) {
            const baseArr = Object.entries(tempFlowArr[i][1])
            for (let j=0; j<baseArr.length; j++){
                console.log(baseArr[j][1])
                flowArr.push(baseArr[j][1])
            }
        }
        flowArr = flowArr.flat()
        console.log(flowArr)
        if (difficulty !== 'Difficulty') {
            flowArr = flowArr.filter(flow => flow.difficulty === difficulty)
            console.log(flowArr)
        }
        setCustomFlow(flowArr)
    }

    const clearFilters = async () => {
        setMedia('Media')
        setCloud('Cloud Service')
        setDifficulty('Difficulty')
        setCustomFlow([])
    }

    useEffect(() => {
        getFlow(props.flowid)
    }, [])

    return (
        <Card>
            <Card.Header as="h5">{props.flow.class}</Card.Header>
        </Card>
    )


    // return (
    //     <div>
    //         <Card style={{ marginBottom: '20px', maxWidth: '1000px' }}>
    //             <Card.Header as="h5">{props.c}</Card.Header>
    //             {flow.id ?
    //             <Card.Body>
    //                 {loading ? 
    //                     <div style={{marginTop: '100px', height: '150px'}} className="d-flex justify-content-around">
    //                         <Spinner animation="border" />
    //                         <Spinner animation="border" />
    //                         <Spinner animation="border" />
    //                     </div>
    //                 :
    //                 <div>
    //                     <h6>Setup</h6>
    //                     {/* {flow.tags.indexOf('OneDrive') !== 0 && !props.userDB.onedrivecode ?
    //                         <div className="d-flex justify-content-left align-items-center">
    //                             <div style={{ width: '6px', height: '6px', backgroundColor: '#CB444A', borderRadius: '50%', margin: '0px 3px 2.5px 0px'}}></div>
    //                             <a style={{ textDecoration: 'none'}} href={props.onedriveURL}>
    //                                 <span style={{ color: '#CB444A', marginRight: '10px' }}>Connect OneDrive Account</span>
    //                                 <Button variant="danger">go</Button>
    //                             </a>
    //                         </div>
    //                     : 
    //                         <span></span>
    //                     } */}
    //                     <FlowConnects flow={flow} currentUser={props.currentUser} userDB={props.userDB} />
    //                     <div style={{ borderBottom: '2px solid lightgrey', margin: '15px 0px 15px 0px'}}></div>
    //                     <h6 style={{ borderBottom: '2px solid lightgrey'}}>Tasks</h6>
    //                     <h6 onClick={() => {
    //                         setShowModal(true)
    //                         setLoading(true)}}
    //                     >Flow Info <span style={{ textDecoration: 'underline', color: '#84CACC', cursor: 'pointer'}}>change</span></h6>
    //                     <FlowDisplay flow={flow} />
    //                 </div>
    //                 }
    //             </Card.Body>
    //             :
    //             <div style={{marginTop: '20px'}} className="d-flex justify-content-center">
    //                 <Spinner animation="border" />
    //             </div>
    //             }
    //         </Card>
    //         <Modal show={showModal} onHide={() => {
    //                 setShowModal(false)
    //                 setLoading(false)
    //             }}>
    //             <Modal.Header closeButton>
    //             <Modal.Title>Change studyflow for {props.c}</Modal.Title>
    //             </Modal.Header>
    //             <Modal.Body>
    //                 <div>
    //                 <div style={{ marginBottom: '5px' }}className="d-flex justify-content-between">
    //                     <span><strong>Filters:</strong></span>
    //                     <span onClick={() => clearFilters()} style={{ textAlign: 'right', cursor: 'pointer', textDecoration: 'underline' }}>reset</span>
    //                 </div>
    //                 <div className="d-flex justify-content-around flex-wrap">
    //                     <DropdownButton id="dropdown-basic-button" title={media}>
    //                         <Dropdown.Item onClick={async () => {
    //                             setMedia('Notability')
    //                             filterFlows(['Notability'], difficulty)
    //                         }}>Notability</Dropdown.Item>
    //                         <Dropdown.Item onClick={async () => {
    //                             setMedia('Goodnotes')
    //                             filterFlows(['Goodnotes'], difficulty)
    //                         }}>Goodnotes</Dropdown.Item>
    //                         <Dropdown.Item onClick={async () => {
    //                             setMedia('OneNotes')
    //                             filterFlows(['OneNotes'], difficulty)
    //                         }}>OneNotes</Dropdown.Item>
    //                         <Dropdown.Item onClick={async () => {
    //                             setMedia('Paper')
    //                             filterFlows(['Paper'], difficulty)
    //                         }}>Paper</Dropdown.Item>
    //                     </DropdownButton>
    //                     <DropdownButton id="dropdown-basic-button" title={cloud}>
    //                         <Dropdown.Item onClick={async () => {
    //                             setCloud('OneDrive')
    //                             filterFlows([media, 'OneDrive'], difficulty)
    //                         }}>OneDrive</Dropdown.Item>
    //                         <Dropdown.Item onClick={async () => {
    //                             setCloud('Google Drive')
    //                             filterFlows([media, 'Google Drive'], difficulty)
    //                         }}>Google Drive</Dropdown.Item>
    //                         <Dropdown.Item onClick={async () => {
    //                             setCloud('Dropbox')
    //                             filterFlows([media, 'Dropbox'], difficulty)
    //                         }}>Dropbox</Dropdown.Item>
    //                     </DropdownButton>
    //                     <DropdownButton id="dropdown-basic-button" title={difficulty}>
    //                         <Dropdown.Item onClick={async () => {
    //                             setDifficulty('Easy')
    //                             filterFlows([media, cloud], 'Easy')
    //                         }}>Easy</Dropdown.Item>
    //                         <Dropdown.Item onClick={async () => {
    //                             setDifficulty('Average')
    //                             filterFlows([media, cloud], 'Average')
    //                         }}>Average</Dropdown.Item>
    //                         <Dropdown.Item onClick={async () => {
    //                             setDifficulty('Hard')
    //                             filterFlows([media, cloud], 'Hard')
    //                         }}>Hard</Dropdown.Item>
    //                     </DropdownButton>
    //                 </div>
    //             </div>
    //             <div>
    //                 {customFlow.length > 1 ? 
    //                     <div>
    //                     {customFlow.map((flow, key) => {
    //                         return (
    //                         <div 
    //                             onClick={() => changeFlow(flow.id)}
    //                             style={{ border: '2px solid lightgrey', padding: '10px', margin: '20px 0px', borderRadius: '1%', cursor: 'pointer'}}
    //                         >
    //                             <FlowDisplay showDifficulty={true} flow={flow} />
    //                         </div>)
    //                     })}
    //                     </div>
    //                 :
    //                     <div>
    //                     {props.flowList.map((flow, key) => {
    //                         return (
    //                         <div 
    //                             onClick={() => changeFlow(flow.id)}
    //                             style={{ border: '2px solid lightgrey', padding: '10px', margin: '20px 0px', borderRadius: '1%', cursor: 'pointer'}}
    //                         >
    //                             <FlowDisplay showDifficulty={true} flow={flow} />
    //                         </div>)
    //                     })}
    //                     </div>
    //                 }
    //             </div>
    //                 {/* <Flows classIndex={currentClassKey} user={userDB} surveyResponse={surveyResponse} class={currentClass} flowList={flowList}/> */}
    //             </Modal.Body>
    //             <Modal.Footer>
    //             <Button variant="secondary" onClick={() => setShowModal(false)}>
    //                 Close
    //             </Button>
    //             </Modal.Footer>
    //         </Modal>  
              
    //     </div>
            
    // )
}
