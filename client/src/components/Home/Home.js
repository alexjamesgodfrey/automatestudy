import React, { useState, useEffect } from 'react'
import Fade from 'react-bootstrap/Fade'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../Header/Header'
import NotLoggedIn from './NotLoggedIn'
import LoggedIn from './LoggedIn'

export default function Home() {
    const { currentUser } = useAuth()
    const [open, setOpen] = useState(false)


    useEffect(() => {
        setOpen(true)
    }, [])

    return (
        <Fade in={open}>
            <div>
                <Header />
                {currentUser ?
                    <LoggedIn />
                :
                    <NotLoggedIn />
                }
            </div>
        </Fade>
    )
}
