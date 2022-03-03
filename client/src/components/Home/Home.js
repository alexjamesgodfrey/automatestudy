import React, { useState, useEffect } from 'react'
import Fade from 'react-bootstrap/Fade'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../Header/Header'
import NotLoggedIn from './NotLoggedIn'
import LoggedIn from './LoggedIn'
import Sidebar from '../Sidebar/Sidebar'

export default function Home() {
    const { currentUser } = useAuth()
    const [open, setOpen] = useState(false)


    useEffect(() => {
        setOpen(true)
    }, [])

    return (
        <Fade in={open}>
            <div>
                {/* <Header /> */}
                {currentUser ?
                    <div className='d-flex'>
                        <Sidebar />
                        <LoggedIn />
                    </div>
                :
                    <NotLoggedIn />
                }
            </div>
        </Fade>
    )
}
