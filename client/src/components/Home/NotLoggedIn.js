import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import FlowDisplay from '../Flow/FlowDisplay'
import notability from '../../images/notability.png'
import onedrive from '../../images/onedrive.svg'
import dropbox from '../../images/dropbox.svg'
import goodnotes from '../../images/goodnotes.png'
import onenote from '../../images/onenote.svg'
import googledrive from '../../images/googledrive.svg'
import notion from '../../images/notion.svg'
import microsofttodo from '../../images/microsofttodo.png'
import todoist from '../../images/todoist.svg'

export default function NotLoggedIn() {
    const { googleSignup } = useAuth()
    const [loading, setLoading] = useState(false)
    const sampleFlow = {
        id: "31", 
        description: "Create Notability note (automatic backup to OneDrive), automatic notion page creation for active recall questions, 4 spaced repetition review tasks created over 30 days.", 
        tags: ["Notability", "OneDrive", "Notion", "Todoist"], 
        difficulty: "Average", 
        recommended: true,
        taskCount: '4', 
        taskduration: '30'
    }

    const google = async () => {
        setLoading(true);

        try {
            await googleSignup();
        } catch (error) {
            return setLoading(false)
        }

        setLoading(false);
    }
    return (
        <div style={{ maxWidth: '1300px', margin: '0px auto'}}>
            <h3 style={{ textAlign: 'center' }}>welcome to <span style={{ color: '#4FB0AE' }}>studyflow.ai</span></h3>
            <p className="mb-2 text-muted" style={{ textAlign: 'center' }}>automated workflow for students</p>
            <div style={{margin: '0px 20px' }} className="d-flex justify-content-around flex-wrap">
                <Card style={{ width: '300px', height: '150px', margin: '15px' }}>
                    <Card.Header as="h5">what we do</Card.Header>
                    <Card.Body>
                        <Card.Text>
                            we help you implement our seamless study system that is focused solely on 
                            <span style={{ color: '#4FB0AE' }}> saving your time</span>.
                        </Card.Text>    
                    </Card.Body>
                </Card>
                <Card style={{ width: '300px', height: '150px', margin: '15px' }}>
                    <Card.Header as="h5">how we do it</Card.Header>
                    <Card.Body>
                        <Card.Text>
                            we <span style={{ color: '#4FB0AE' }}>automate as much as possible:</span> your study intervals, intensity, and note backup.
                        </Card.Text>    
                    </Card.Body>
                </Card>
                <Card style={{ width: '300px', height: '150px', margin: '15px' }}>
                    <Card.Header as="h5">why we do it</Card.Header>
                    <Card.Body>
                        <Card.Text>
                            so any student can easily implement a proven study strategy
                             that helps them <span style={{ color: '#4FB0AE' }}>learn more in less time</span>.
                        </Card.Text>    
                    </Card.Body>
                </Card>
            </div>
            <h4>Example <span style={{ color: '#4FB0AE' }}>studyflow</span></h4>
            <div onClick={() => google()} style={{ margin: '20px 20px'}}>
                <div 
                    style={{ border: '2px solid lightgrey', padding: '10px', margin: '20px 0px', borderRadius: '1%', cursor: 'pointer'}}
                >
                    <FlowDisplay showDifficulty={false} flow={sampleFlow} />
                </div>
                <div style={{ margin: '30px' }} className="d-flex justify-content-center"><Button size="md" disabled={loading} onClick={() => google()}variant="primary"><span style={{ color: 'white' }}>get started in 30 seconds</span></Button></div>
            </div>
            <h4><span style={{ color: '#4FB0AE' }}>studyflow</span> integrates the following apps</h4>
            <div style={{ margin: '20px 0px 50px 0px'}} className="d-flex align-items-center justify-content-around flex-wrap">
                <div><img style={{ width: '53px'}} src={notability} alt="notability icon" /></div>
                <div><img style={{ width: '50px'}} src={goodnotes} alt="goodnotes icon" /></div>
                <img style={{ width: '50px'}} src={onenote} alt="one note icon" />
                <img style={{ width: '54px'}} src={onedrive} alt="onedrive icon" />
                <img style={{ width: '50px'}} src={googledrive} alt="google drive icon" />
                <img style={{ width: '50px'}} src={dropbox} alt="dropbox icon" />
                <img style={{ width: '45px', marginTop: '2px'}} src={notion} alt="notion icon" />
                <div><img style={{ width: '45px', margin: '2px 3px 0px 0px' }} src={microsofttodo} alt="microsoft todo icon" /></div>
                <img style={{ width: '45px', margin: '2px 3px 0px 0px' }} src={todoist} alt="todoist icon" />
            </div>
        </div>
    )
}
