import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Toggle from 'react-toggle'
import Card from 'react-bootstrap/Card'
import DropdownButton from 'react-bootstrap/DropdownButton'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import Overlay from 'react-bootstrap/Overlay'
import '../Home/ProfileCards.scss'
import DropdownItem from 'react-bootstrap/esm/DropdownItem'
import { isNull } from 'underscore'

export default function Class(props) {
    const { currentUser, userDB } = useAuth()
    const [drives, setDrives] = useState([])
    const [driveName, setDriveName] = useState('')
    const [driveID, setDriveID] = useState('')
    const [loadingFolders, setLoadingFolders] = useState(false)
    const [folderID, setFolderID] = useState('')
    const [path, setPath] = useState('')
    const [showPath, setShowPath] = useState(false)
    const [pathOptions, setPathOptions] = useState([])
    const pathRef = useRef(null)
    const [flowActivating, setFlowActivating] = useState(false)

    const getDrives = async () => {
        const json = {
            access_token: userDB.cloudaccess,
            refresh_token: userDB.cloudrefresh
        }
        console.log(JSON.stringify(json))
        await fetch(`/api/onedrive/drives`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        })
            .then(response => response.json())
            .then(data => {
                const driveArr = []
                for (let i = 0; i < data.length; i++) {
                    driveArr.push({
                        driveType: data[i].driveType,
                        id: data[i].id,
                        children: getFolders(data[i].id, '')
                    })
                }
                console.log(driveArr)
                setDrives(driveArr)
                setDriveName(driveArr[0].driveType)
                setDriveID(driveArr[0].id)
            })
    }

    const getFolders = async (driveid, childid) => {
        setLoadingFolders(true)
        const json = {
            access_token: userDB.cloudaccess,
            driveid: driveid,
            childid: childid
        }
        console.log(json)
        await fetch(`/api/onedrive/children`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                const withoutFolders = data.filter((d) => d.folder ? d : null)
                const namesAndIds = withoutFolders.map((d) => {
                    console.log(d)
                    if (d.folder) {
                        return {
                            name: d.name,
                            id: d.id,
                        }
                    }
                })
                setPathOptions(namesAndIds)
                setLoadingFolders(false)
                if (namesAndIds.length === 0) {
                    setShowPath(false)
                }
            })
    }

    const activateWithPath = async () => {
        setFlowActivating(true)
        //activate flow
        await fetch(`/api/flows/activate/${props.id}`, {method: "PUT"})
        //general json
        const json = {
            path: path,
            folderid: folderID,
            driveid: driveID
        }
        //update path
        await fetch(`/api/flows/path/${props.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        })
        //update folderid
        await fetch(`/api/flows/folderid/${props.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        })
        //update driveid
        await fetch(`/api/flows/driveid/${props.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        })
        const json2 = {
            access_token: userDB.cloudaccess,
            driveid: driveID,
            childid: folderID 
        }
        console.log(json2)
        //update pastfiles, but get children first
        await fetch(`/api/onedrive/children`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json2)
        })
            .then(response => response.json())
            .then(async data => {
                console.log(data)
                const json3 = {
                    pastfiles: data
                }
                await fetch(`/api/flows/pastfiles/${props.id}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(json3)
                })
            })
        setFlowActivating(false)
        window.location.reload(true)
    }

    const toggleActive = async () => {
        if (props.active) {
            await fetch(`/api/flows/deactivate/${props.id}`, { method: "PUT" })
        } else {
            await fetch(`/api/flows/activate/${props.id}`, { method: "PUT" })
        }
    }

    useEffect(() => {
        getDrives()
    }, [])

    return (
        <Card style={{ margin: '10px'}}>
            <Card.Header as="h5">
                <div className='d-flex justify-content-between'>
                    {props.class}
                    <Toggle
                        id='public-status'
                        className='custom-colors'
                        disabled={props.path === isNull}
                        defaultChecked={props.active}
                        onChange={() => toggleActive()}
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
                        <div>
                            Choose Drive
                            <DropdownButton style={{ marginLeft: '10px' }} size="sm" id="dropdown-basic-button" title={driveName}>
                                {drives.map((d, i) => {
                                    return <DropdownItem
                                        onClick={() => {
                                            setDriveName(d.driveType)
                                            setDriveID(d.id)
                                        }}>
                                        {d.driveType}
                                    </DropdownItem>
                                })}
                            </DropdownButton>
                        </div>
                        <div>
                            Choose Path -- Example: /Notability/CS1110
                            <div>
                                <OverlayTrigger
                                    placement="right"
                                    overlay={
                                        <Popover id="popover-basic">
                                            <Popover.Header as="h3">Choose Folder</Popover.Header>
                                            <Popover.Body>
                                                {loadingFolders ? 
                                                    <Spinner variant="primary" size="sm" animation="border" />
                                                    :
                                                    <div>
                                                        {pathOptions.map((p, i) => {
                                                            return <p
                                                                style={{ lineHeight: 0.5, fontSize: '16px', cursor: 'pointer' }}
                                                                onClick={() => {
                                                                    getFolders(driveID, p.id)
                                                                    setPath(path + '/' + p.name)
                                                                    setFolderID(p.id)
                                                                }}>
                                                                {p.name}
                                                            </p>
                                                        })}
                                                    </div>
                                                }
                                            </Popover.Body>
                                        </Popover>
                                    }
                                    trigger='click'
                                    show={showPath}
                                >
                                        <span
                                            style={{
                                                backgroundColor: '#84CACC', margin: '5px 0px 0px 10px',
                                                cursor: 'pointer', borderRadius: '2px', padding: '2px 8px'
                                            }}
                                            ref={pathRef}
                                            onClick={() => setShowPath(!showPath)}
                                        >{path || 'click here'}</span>
                                        
                                    
                                </OverlayTrigger>
                                <span
                                    onClick={() => {
                                        setPath('')
                                        getFolders(driveID)
                                    }}
                                    style={{ marginLeft: '10px', cursor: 'pointer' }}
                                    >clear path</span>
                            </div>
                        </div>
                        {path ? 
                            <Button disabled={flowActivating} style={{ marginTop: '10px'}} onClick={() => activateWithPath()}>Activate Studyflow</Button>
                        :
                            <span></span>
                        }
                    </Card.Text>
                }
            </Card.Body>
        </Card>
    )
}
