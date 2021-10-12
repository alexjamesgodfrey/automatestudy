import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from 'react-bootstrap/Navbar'


export default function Header() {
    const { currentUser, googleSignup, logout } = useAuth()
    const [loading, setLoading] = useState(false)

    console.log(currentUser)

    const google = async () => {
        setLoading(true);

        try {
            await googleSignup();
        } catch (error) {
            return null
        }

        setLoading(false);
    }

    return (
        <div style={{ borderBottom: '2px solid lightgrey'}}>
            <Navbar style={{ margin: '0px 20px'}}>
                <Navbar.Brand href="#home"><strong>studyflow</strong></Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                {currentUser ? 
                    <Navbar.Text onClick={() => logout()}>
                        Signed in as: <span style={{ color: '#4FB0AE', textDecoration: 'underline' }}>{currentUser.displayName}</span>
                    </Navbar.Text>
                :
                    <Navbar.Text style={{ cursor: 'pointer'}} onClick={() => google()}>
                        <span style={{ color: '#4FB0AE' }}><strong>Sign in</strong></span>
                    </Navbar.Text>
                }
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}
