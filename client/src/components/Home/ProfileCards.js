import React, { useState, useRef, useEffect } from 'react'
import app from '../../firebase.js';
import { useAuth } from '../../contexts/AuthContext'
import { Checkmark } from 'react-checkmark'
import Form from 'react-bootstrap/Form'
import Toggle from 'react-toggle'
import Card from 'react-bootstrap/Card'
import Overlay from 'react-bootstrap/Overlay'
import Tooltip from 'react-bootstrap/Tooltip'
import Button from 'react-bootstrap/Button'
import './ProfileCards.scss'

export default function ProfileCards() {
    const { currentUser, userDB, updatePhotoURL, updateDisplayName, logout } = useAuth()
    const [loading, setLoading] = useState(false)
    const [tempURL, setTempURL] = useState('')
    const [editDisplayName, setEditDisplayName] = useState(false)
    const [tempDisplayName, setTempDisplayName] = useState('')
    const [flowCount, setFlowCount] = useState("0")
    const [nthUser, setNthUser] = useState("")
    const primaryColor = '#84cacc'
    const [showPublicAccountTip, setShowPublicAccountTip] = useState(false)
    const publicAccountTarget = useRef(null)

    console.log(currentUser)
    

    const handlePublicChange = async () => {
        const checked = document.getElementById('public-status').checked
        if (checked) {
            await fetch(`/api/users/makepublic/${currentUser.uid}`, {
                method: 'PUT'
            })
        } else {
            await fetch(`/api/users/makeprivate/${currentUser.uid}`, {
                method: 'PUT'
            })
        }
    }

    const uploadPicture = async (e) => {
        setLoading(true)
        const file = e.target.files[0];
        const storageRef = app.storage().ref();
        const fileRef = storageRef.child(file.name);
        await fileRef.put(file);
        const url = await fileRef.getDownloadURL();
        setTempURL(url)
        await updatePhotoURL(url);
        setLoading(false)
        const json = `{
            "url": "${url}"
        }`
        await fetch(`/api/users/photourl/${currentUser.uid}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: json
        });
    }

    const changeDisplayName = async () => {
        if (!loading) {
            setLoading(true)
            await updateDisplayName(tempDisplayName)
            const json = `{
                "displayname": "${tempDisplayName}"
            }`
            await fetch(`/api/users/displayname/${currentUser.uid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: json
            });
            setLoading(false)
            setEditDisplayName(false)
        }
    }

    const getFlowCount = async () => {
        await fetch(`/api/history/flowcount/${userDB.id}`)
            .then(response => response.json())
            .then(data => setFlowCount(data.count))
    }

    function nth(n){return["st","nd","rd"][((n+90)%100-10)%10-1]||"th"}
    const getNthUser = async () => {
        await fetch(`/api/nthuser/${userDB.id}`)
            .then(response => response.json())
            .then(data => {
                const nthUserTemp = nth(data.nthuser)
                setNthUser(data.nthuser + nthUserTemp)
            })
    }

    useEffect(() => {
        getFlowCount()
        getNthUser()
    }, [])

    return (
        <div style={{ margin: '20px 0px' }} className="d-flex justify-content-center"> 
            <Card style={{ margin: '0px 20px', width: '300px' }}>
                <Card.Header as="h5">{tempDisplayName || currentUser.displayName}</Card.Header>
                <div style={{ margin: '10px' }}>
                    <div className="d-flex">
                        <div style={{ height: '80px', marginBottom: '5px'}}>
                            <img style={{ width: '80px', maxHeight: '80px', borderRadius: '50%' }} src={tempURL || currentUser.photoURL} alt="upload profile" />
                        </div>
                        <div style={{ marginLeft: '10px'}}>
                            {editDisplayName ? 
                                <div style={{ marginBottom: '10px'}}>
                                    <Form.Control style={{ marginBottom: '10px' }} size="sm" type="text" placeholder="new username" onChange={(e) => setTempDisplayName(e.target.value)} />
                                    <Button
                                        onClick={() => changeDisplayName()}
                                        style={{ height: '30px', fontSize: '14px' }}
                                        disabled={loading}
                                        variant="primary"
                                        size="sm"
                                    >
                                        update username
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setTempDisplayName('')
                                            setEditDisplayName(false)
                                        }}
                                        style={{ height: '30px', marginLeft: '10px', width: '40px' }} 
                                        variant="danger" size="sm"
                                    >
                                        <span style={{ color: 'white' }}>X</span>
                                    </Button>
                                </div>
                            :
                                <p
                                    style={{ lineHeight: 0.5, marginLeft: '5px', cursor: 'pointer' }}
                                    onClick={() => setEditDisplayName(true)}
                                >{tempDisplayName || currentUser.displayName} <span style={{ textDecoration: 'underline'}}>edit</span></p>
                            }
                            <Card.Text style={{ margin: '5px 10px 0px 10px' }} className="d-flex align-items-center">
                                <span style={{ width: '100px', lineHeight: 1.2}}>{userDB.cloud}</span>
                                <Checkmark size="small" color={primaryColor} />
                            </Card.Text>
                            <Card.Text style={{ margin: '0px 10px'}} className="d-flex align-items-center">
                                <span style={{ width: '100px', lineHeight: 1.2}}>Notion</span>
                                <Checkmark size="small" color={primaryColor} />
                            </Card.Text>
                            {userDB.todoistaccess ? 
                                <Card.Text style={{ margin: '0px 10px'}} className="d-flex align-items-center">
                                    <span style={{ width: '100px', lineHeight: 1.2}}>Todoist</span>
                                    <Checkmark size="small" color={primaryColor} />
                                </Card.Text>
                            :
                                <span></span>
                            }
                        </div>
                    </div>
                    <Form.Control style={{ width: '180px', fontSize: '12px' }} type="file" size="sm" disabled={loading} accept="image/*" onChange={(e) => uploadPicture(e)}/>
                </div>
            </Card>
            <Card style={{ margin: '0px 20px', width: '300px' }}>
                <Card.Header as="h5">Stats</Card.Header>
                <Card.Text style={{ margin: '5px 10px' }} >
                    You registered on <strong>{currentUser.metadata.creationTime.substring(0, currentUser.metadata.creationTime.length-12)}</strong>
                    as the <strong>{nthUser}</strong> studyflow user.
                    You have executed <strong>{flowCount}</strong> studyflows.
                </Card.Text>
            </Card>
            <Card style={{ margin: '0px 20px', width: '300px' }}>
                <Card.Header as="h5">Settings</Card.Header>
                <Card.Text style={{ margin: '5px 10px' }} className="d-flex align-items-center">
                    <label 
                        htmlFor='public-status'
                        style={{ width: '160px' }}
                        ref={publicAccountTarget}
                        onMouseEnter={() => setShowPublicAccountTip(true)}
                        onMouseLeave={() => setShowPublicAccountTip(false)}
                    >Public Account </label>
                    <Overlay target={publicAccountTarget.current} show={showPublicAccountTip} placement="bottom">
                        <Tooltip>
                            If enabled, users in the Studyflow community will be able to view your username,
                            profile picture, school, notes, and classes.
                        </Tooltip>
                    </Overlay>
                    <Toggle
                        id='public-status'
                        defaultChecked={userDB.public}
                        onChange={handlePublicChange}
                        className='custom-colors'
                    />
                    
                </Card.Text>
                {!userDB.stripesubscription ?
                    <a style={{ color: 'red' }} href={process.env.REACT_APP_STRIPE_LINK} target="_blank" rel="noreferrer">
                        <Card.Text style={{ margin: '5px 10px' }} className="d-flex align-items-center">
                            <span style={{ width: '160px' }}>Activate Account</span>
                        </Card.Text>
                    </a>
                :
                    <Card.Text style={{ margin: '5px 10px' }} className="d-flex align-items-center">
                        Subscription renews {new Date(userDB.stripesubscription.current_period_end*1000).toDateString()}
                    </Card.Text>
                }
                
                <Button onClick={logout} size="sm" style={{ width: '100px', margin: '20px auto' }} variant="danger"><span style={{ color: 'white' }}>Log out</span></Button>
            </Card>
        </div>
    )
}
