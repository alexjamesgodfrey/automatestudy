import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { PopupButton } from '@typeform/embed-react'

export default function Survey() {
    const { currentUser } = useAuth()
    return (
        <PopupButton 
            id="k6G9ENWE" 
            style={{ fontSize: 20 }} 
            className="btn btn-primary"
            hidden={{
                name: currentUser.displayName,
                uid: currentUser.uid,
                email: currentUser.email
            }}>
            <span style={{ color: 'white' }}>start survey</span>
        </PopupButton>
    )
}
