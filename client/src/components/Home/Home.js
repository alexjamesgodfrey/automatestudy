import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../Header/Header'
import Survey from './Survey'
import NotLoggedIn from './NotLoggedIn'
import LoggedIn from './LoggedIn'

export default function Home() {
    const { currentUser } = useAuth()

    return (
        <div>
            <Header />
            <div className="d-flex justify-content-center">
            {currentUser ?
                <div>
                    <LoggedIn />
                </div>
            :
                <div style={{ marginTop: '10px' }}>
                    <NotLoggedIn />
                </div>}
            </div>
        </div>
    )
}
