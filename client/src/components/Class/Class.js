import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Toggle from 'react-toggle'
import Card from 'react-bootstrap/Card'
import '../Home/ProfileCards.scss'

export default function Class(props) {
    const { currentUser, userDB } = useAuth()

    return (
        <Card style={{ margin: '10px'}}>
            <Card.Header as="h5">
                <div className='d-flex justify-content-between'>
                    {props.class}
                    <Toggle
                        id='public-status'
                        className='custom-colors'
                        disabled={!props.path}
                        defaultChecked={props.active}
                    />
                </div>
            </Card.Header>
            <Card.Body>
                {props.path ? 
                    <p>flow</p>
                :
                    <Card.Text>
                        To active this Studyflow, you must select the {userDB.cloud} file path for this class.
                        Whenever a new file appears in this folder, this Studyflow will execute.
                    </Card.Text>
                }
            </Card.Body>
        </Card>
    )
}
