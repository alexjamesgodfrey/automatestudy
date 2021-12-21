import React from 'react'
import Toggle from 'react-toggle'
import Card from 'react-bootstrap/Card'
import '../Home/ProfileCards.scss'

export default function Class(props) {
    return (
        <Card>
            <Card.Header>
                <div className='d-flex justify-content-between'>
                    {props.title}
                    <Toggle
                        id='public-status'
                        className='custom-colors'
                        disabled={true}
                    />
                </div>
            </Card.Header>
        </Card>
    )
}
