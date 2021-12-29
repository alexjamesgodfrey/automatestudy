import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from 'react-bootstrap/Navbar'


export default function Header() {
    const { currentUser, googleSignup, logout } = useAuth()

    const google = async () => {
        try {
            await googleSignup();
        } catch (error) {
            return null
        }
    }

    return (
        <div style={{ borderBottom: '2px solid lightgrey'}}>
            <Navbar style={{ margin: '0px 20px'}}>
                <Navbar.Brand href="#home">
                    <div className="d-flex flex-column">
                        <strong style={{lineHeight: 1, marginTop: '3px'}}>studyflow</strong>
                        <strong style={{fontSize: '17px', textAlign: 'right', lineHeight: 0.75}}>beta</strong>
                    </div>
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                {currentUser ? 
                    <Navbar.Text onClick={() => logout()}>
                        signed in as <span style={{ color: '#4FB0AE', textDecoration: 'underline' }}>{currentUser.displayName}</span>
                    </Navbar.Text>
                :
                    <Navbar.Text style={{ cursor: 'pointer'}} onClick={() => google()}>
                        <span style={{ color: '#4FB0AE' }}><strong>sign in</strong></span>
                    </Navbar.Text>
                }
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}
