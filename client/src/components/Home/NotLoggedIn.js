import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import './NotLoggedIn.scss'
import arrowRight from '../../images/arrowright.svg'
import notability from '../../images/notability.png'
import onedrive from '../../images/onedrive.svg'
import notion from '../../images/notion.svg'
import todoist from '../../images/todoist.svg'

export default function NotLoggedIn() {
    const { googleSignup } = useAuth()
    const [loading, setLoading] = useState(false)

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
        <div>
            <h3 style={{ textAlign: 'center' }}>Welcome to <span style={{ color: '#4FB0AE' }}>studyflow.ai</span></h3>
            <p className="mb-2 text-muted" style={{ textAlign: 'center' }}>automated workflow for students</p>
            <div style={{margin: '0px 20px' }} className="d-flex justify-content-around flex-wrap">
                <Card style={{ width: '300px', margin: '15px' }}>
                    <Card.Header as="h5">What we do</Card.Header>
                    <Card.Body>
                        <Card.Text>
                            We help you implement our revolutionary study system that is focused solely on study efficiency.
                            What we do is <span style={{ color: '#4FB0AE' }}>save your time</span>.
                        </Card.Text>    
                    </Card.Body>
                </Card>
                <Card style={{ width: '300px', height: '200px', margin: '15px' }}>
                    <Card.Header as="h5">How we do it</Card.Header>
                    <Card.Body>
                        <Card.Text>
                            We <span style={{ color: '#4FB0AE' }}>automate as much as possible</span>. This includes your study intervals, study intensity,
                            and menial tasks like backing up your notes.
                        </Card.Text>    
                    </Card.Body>
                </Card>
                <Card style={{ width: '300px', height: '200px', margin: '15px' }}>
                    <Card.Header as="h5">Why</Card.Header>
                    <Card.Body>
                        <Card.Text>
                            Creating your own study system is hard. Automation takes programming skills.
                            We want to help students <span style={{ color: '#4FB0AE' }}>study efficiently</span> so they have as much free time as possible.
                        </Card.Text>    
                    </Card.Body>
                </Card>
                {/* <Card style={{ marginTop: '15px' }} className="text-center">
                    <Card.Header as="h5">Our system in a nutshell</Card.Header>
                    <Card.Body>
                        <Card.Subtitle className="mb-2 text-muted">Full setup takes just 10 minutes</Card.Subtitle>
                        <Card.Text>
                            1. You <span style={{ color: '#4FB0AE' }}>take a note</span> in your medium of choice: digital writing, paper, or computer.
                            <br />
                            2. A <span style={{ color: '#4FB0AE', textDecoration: 'underline' }}>notion</span> page will automatically be created for your note.
                            <br />
                            3. You fill out this notion page after class with <span style={{ color: '#4FB0AE', textDecoration: 'underline' }}>active recall questions</span>.
                            <br />
                            4. <span style={{ color: '#4FB0AE' }}>Four review tasks</span> are automatically created in Todoist based on <span style={{ color: '#4FB0AE', textDecoration: 'underline' }}>spaced repetition.</span>
                            <br />
                            5. You will review your note based on the Todoist tasks, so you <span style={{ color: '#4FB0AE' }}>never have to cram again.</span>
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer><Button disabled={loading} onClick={() => google()}variant="primary"><span style={{ color: 'white' }}>Get Started</span></Button></Card.Footer>
                </Card> */}
            </div>
            <h3 style={{ marginLeft: '20px'}}>Example <span style={{ color: '#4FB0AE' }}>studyflow</span></h3>
            <div style={{ margin: '20px 20px'}}>
                <div className="d-flex align-items-start justify-content-around">
                    <div className="d-flex flex-column align-items-center">
                        <img style={{ width: '70px'}} src={notability} alt="notability icon" />
                        <p style={{ textAlign: 'center' }}>create note in notability</p>
                    </div>
                    <img className="icon" src={arrowRight} alt="arrow facing right" />
                    <div className="d-flex flex-column align-items-center">
                        <img  style={{ width: '70px'}} src={onedrive} alt="onedrive icon" />
                        <p style={{ textAlign: 'center' }}><span style={{ color: '#4FB0AE' }}>automatic</span> backup to oneDrive</p>
                    </div>
                    <img className="icon" src={arrowRight} alt="arrow facing right" />
                    <div className="d-flex flex-column align-items-center">
                        <img style={{ width: '60px', marginBottom: '5px'}} src={notion} alt="notion icon" />
                        <p style={{ textAlign: 'center', margin: '0px' }}>1. <span style={{ color: '#4FB0AE' }}>automatic</span> notion page creation</p>
                        <p style={{ textAlign: 'center' }}>2. create active recall questions</p>
                    </div>
                    <img className="icon" src={arrowRight} alt="arrow facing right" />
                    <div className="d-flex flex-column align-items-center">
                        <img  style={{ width: '60px', marginBottom: '5px' }} src={todoist} alt="todoist icon" />
                        <p style={{ textAlign: 'center', margin: '0px' }}>1. four review tasks <span style={{ color: '#4FB0AE' }}>automatically</span> created in todoist</p>
                        <p style={{ textAlign: 'center' }}>2. review at time intervals for maximum retention</p>
                    </div>
                </div>
                <div style={{ margin: '30px' }} className="d-flex justify-content-center"><Button disabled={loading} onClick={() => google()}variant="primary"><span style={{ color: 'white' }}>get started</span></Button></div>
            </div>
        </div>
    )
}
