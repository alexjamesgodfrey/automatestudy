import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
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
import wave from '../../images/wave.svg'
import './NotLoggedIn.scss'

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
        <div style={{ position: 'absolute', top: '0', width: '100%', zIndex: -1}} className='d-flex flex-column flex-wrap justify-content-center align-items-center'>
            <div style={{ height: '100vh', width: '100%', backgroundColor: 'white' }}>
                <div style={{ marginTop: '30vh' }}>
                    <p style={{ fontSize: '100px', fontWeight: '700', textAlign: 'center'}}>welcome to studyflow.ai</p>
                    <p style={{ fontSize: '65px', textAlign: 'center', marginBottom: '100px' }} className="mb-2 text-muted">automated workflow for students</p>
                    <p style={{ fontSize: '40px', textAlign: 'center', marginTop: '100px', fontWeight: 600 }}>scroll to begin</p>
                </div>
            </div>
            <div style={{ height: '70vh', zIndex: '-10' }}>
                <div style={{ position: 'absolute', right: '1px'}}>
                    <p style={{ fontSize: '8em', textAlign: 'center', fontWeight: '700' }}>
                        studyflow connects all your apps for an optimized learning experience
                    </p>
                </div>
                <div style={{ marginRight: '100px', marginTop: '25vh'}}>
                    <div style={{ position: 'absolute', zIndex: '-1'}}>
                        <img style={{ width: '400px', position: 'absolute', left: '-150px', top: '-150px' }} src={wave}/>
                    </div>
                    <Parallax x={['-400px', '400px']} y={['400px', '-400px']} className='connect'>
                        <img style={{ width: '100px'}} src={goodnotes} alt="goodnotes icon"/>
                    </Parallax>
                    <Parallax x={['400px', '-400px']} y={['400px', '-400px']} className='connect'>
                        <img style={{ width: '100px', borderRadius: '50%'}} src={notability} alt="notability icon"/>
                    </Parallax>
                    <Parallax y={['400px', '-400px']} className='connect'>
                        <img style={{ width: '100px'}} src={onenote} alt="onenote icon"/>
                    </Parallax>
                    <Parallax x={['-400px', '400px']} className='connect'>
                       <img style={{ width: '100px'}} src={onedrive} alt="onedrive icon" />
                    </Parallax>
                    <Parallax x={['400px', '-400px']} className='connect'>
                       <img style={{ width: '100px'}} src={googledrive} alt="googledrive icon" />
                    </Parallax>
                    <Parallax y={['-400px', '400px']} className='connect'>
                        <img style={{ width: '100px' }} src={notion} alt="goodnotes icon"/>
                    </Parallax>
                    <Parallax x={['-400px', '400px']} y={['-400px', '400px']} className='connect'>
                        <img style={{ width: '100px' }} src={microsofttodo} alt="microsoft todo icon"/>
                    </Parallax>
                    <Parallax x={['400px', '-400px']} y={['-400px', '400px']} className='connect'>
                        <img style={{ width: '85px' }} src={todoist} alt="todoist icon"/>
                    </Parallax>
                </div>
            </div>
            <div style={{ backgroundColor: 'white', height: '200vh'}}>
                <p style={{ fontSize: '8em', textAlign: 'center', fontWeight: '700' }}>
                    studyflow automates note <span style={{ color: '#84cacc' }}>backup</span>, 
                    <span style={{ color: '#84cacc' }}> organization</span>, and review
                    <span style={{ color: '#84cacc' }}> scheduling</span> to save you time 
                    and get you better grades
                </p>
                <p style={{ fontSize: '8em', textAlign: 'center', fontWeight: '700', marginTop: '100px' }}>
                    become the most organized student you know in <span style={{ color: '#84cacc' }}>10 minutes</span>
                </p>
                <p onClick={() => google()} style={{ fontSize: '8em', textAlign: 'center', fontWeight: '700', width: '100%', cursor: 'pointer' }}>
                    {`go ➤`}
                </p>
            </div>
            {/* <div style={{ maxWidth: '1300px', margin: '0px auto', backgroundColor: 'white', zIndex: '10' }}>
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
            </div> */}
        </div>
    )
}
