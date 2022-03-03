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
    const IMAGE_WIDTH = '100px'
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
        <div>
            <div id="showsmall">
                <p style={{ fontSize: '30px', fontWeight: '700', textAlign: 'center' }}>welcome to studyflow.ai</p>
                <p style={{ fontSize: '20px', textAlign: 'center', marginBottom: '100px' }} className="mb-2 text-muted">automated workflow for students</p>
                <p style={{ fontSize: '20px', textAlign: 'center', fontWeight: 600 }}>Studyflow is best configured on desktop, but you can still create an account now.</p>
                <p onClick={() => google()} style={{ fontSize: '25px', color: '#4FB0AE', textAlign: 'center', cursor: 'pointer'}}>create account</p>
            </div>
            <div style={{ position: 'absolute', top: '0', width: '100%', zIndex: -1}} className='d-flex flex-column flex-wrap justify-content-center align-items-center' id='showBig'>
                <div style={{ height: '100vh', width: '100%', backgroundColor: 'white' }}>
                    <div style={{ marginTop: '30vh' }}>
                        <p style={{ fontSize: '5vw', fontWeight: '700', textAlign: 'center'}}>welcome to studyflow.ai</p>
                        <p style={{ fontSize: '3.4vw', textAlign: 'center', marginBottom: '100px' }} className="mb-2 text-muted">automated workflow for students</p>
                        <p style={{ fontSize: '2.5vw', textAlign: 'center', marginTop: '100px', fontWeight: 600 }}>scroll to begin</p>
                    </div>
                </div>
                <div style={{ zIndex: '-10', height: '500px' }}>
                    <div style={{ position: 'absolute', right: '1px'}}>
                        <p className='optimized-learning-text'>
                            studyflow connects all your apps for an optimized learning experience
                        </p>
                        <p className="optimized-learning-subtext">see our <a className="text-decoration-none" target="_blank" href={process.env.REACT_APP_FRAMEWORK_LINK}><span className='primary-color'>framework and methodology</span></a></p>
                    </div>
                    <div style={{ marginRight: '100px', marginTop: '25vh'}}>
                        <div style={{ position: 'absolute', zIndex: '-1'}}>
                            <img style={{ width: '400px', position: 'absolute', left: '-150px', top: '-200px' }} src={wave}/>
                        </div>
                        <Parallax x={['-400px', '400px']} y={['400px', '-400px']} className='connect'>
                            <img style={{ width: IMAGE_WIDTH}} src={goodnotes} alt="goodnotes icon"/>
                        </Parallax>
                        <Parallax x={['400px', '-400px']} y={['400px', '-400px']} className='connect'>
                            <img style={{ width: IMAGE_WIDTH, borderRadius: '50%'}} src={notability} alt="notability icon"/>
                        </Parallax>
                        <Parallax y={['400px', '-400px']} className='connect'>
                            <img style={{ width: IMAGE_WIDTH}} src={onenote} alt="onenote icon"/>
                        </Parallax>
                        <Parallax x={['-400px', '400px']} className='connect'>
                        <img style={{ width: IMAGE_WIDTH}} src={onedrive} alt="onedrive icon" />
                        </Parallax>
                        <Parallax x={['400px', '-400px']} className='connect'>
                        <img style={{ width: IMAGE_WIDTH}} src={googledrive} alt="googledrive icon" />
                        </Parallax>
                        <Parallax y={['-400px', '400px']} className='connect'>
                            <img style={{ width: IMAGE_WIDTH }} src={notion} alt="goodnotes icon"/>
                        </Parallax>
                        <Parallax x={['-400px', '400px']} y={['-400px', '400px']} className='connect'>
                            <img style={{ width: IMAGE_WIDTH }} src={microsofttodo} alt="microsoft todo icon"/>
                        </Parallax>
                        <Parallax x={['400px', '-400px']} y={['-400px', '400px']} className='connect'>
                            <img style={{ width: IMAGE_WIDTH }} src={todoist} alt="todoist icon"/>
                        </Parallax>
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', height: '800px'}}>
                    <p style={{ fontSize: '5vw', textAlign: 'center', fontWeight: '700', marginTop: '100px' }}>
                        become the most organized student you know in <span style={{ color: '#84cacc' }}>10 minutes</span>
                    </p>
                    <p onClick={() => google()} style={{ fontSize: '100px', textAlign: 'center', fontWeight: '700', width: '100%', cursor: 'pointer' }}>
                        {`go ➤`}
                    </p>
                </div>
            </div>
        </div>
        
    )
}
