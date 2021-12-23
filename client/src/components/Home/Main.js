import React, { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import _, { first, property } from 'underscore'
import { useAuth } from '../../contexts/AuthContext'
import FlowCard from '../Flow/FlowCard'
import ProfileCards from './ProfileCards'
import Class from '../Class/Class'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Notability from '../../images/notability.png'
import Goodnotes from '../../images/goodnotes.png'
import OneNote from '../../images/onenote.svg'
import OneDrive from '../../images/onedrive.svg'
import GoogleDrive from '../../images/googledrive.svg'
import Dropbox from '../../images/dropbox.svg'
import Notion from '../../images/notion.svg'
import arrowRight from '../../images/arrowright.svg'
import refresh from '../../images/refresh.svg'
import logo from '../../images/wave.svg'
import './Fades.scss'
import "react-toggle/style.css"


export default function Main() {
    const { currentUser, userDB, userFlows, surveyResponse } = useAuth()
    const [showModal, setShowModal] = useState(false)
    const [classLoading, setClassLoading] = useState(false)
    const [currentClass, setCurrentClass] = useState('')
    const [currentClassKey, setCurrentClassKey] = useState(0)
    const [flows, setFlows] = useState({})
    
    // const [userFlows, setUserFlows] = useState([])

    // const [customFlow, setCustomFlow] = useState([])
    // const [media, setMedia] = useState("Media")
    // const [cloud, setCloud] = useState("Cloud Service")
    // const [difficulty, setDifficulty] = useState('Difficulty')

    const search = useLocation().search
    const redirectURI = process.env.REACT_APP_REDIRECT_URI
    const todoistClient = process.env.REACT_APP_TODOIST_CLIENT
    const todoistSecret = process.env.REACT_APP_TODOIST_SECRET
    const todoistURL = `https://todoist.com/oauth/authorize?client_id=${todoistClient}&scope=data:read_write,data:delete&state=${todoistSecret}`
    const notionClient = process.env.REACT_APP_NOTION_CLIENT
    const notionState = process.env.REACT_APP_NOTION_SECRET
    const notionSecret = process.env.REACT_APP_NOTION_SECRET
    const notionURL = `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=${notionClient}&redirect_uri=${redirectURI}&response_type=code&state=${notionState}`
    const onedriveClient = process.env.REACT_APP_ONEDRIVE_CLIENT
    const onedriveState = 'onedrive'
    const onedriveURL = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${onedriveClient}&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_mode=query&scope=files.read.all%20user.read&state=${onedriveState}`

    const [step1, setStep1] = useState('')
    const [step2, setStep2] = useState('')
    const sources = {
        'Notion': Notion,
        'OneDrive': OneDrive,
        'GoogleDrive': GoogleDrive,
        'Dropbox': Dropbox,
        'Notability': Notability,
        'Goodnotes': Goodnotes,
        'OneNote': OneNote,

    }
    const arrow =  <img src={arrowRight} className="icon" style={{ width: '50px'}} alt="arrow facing right" />
    
    const checkTodoist = async () => {
        /*
        The following function checks the url for code and secret parameters for
        Todoist connection, and adds the user's code and token after generation to 
        the user database if present.
        */
        if (!userDB.todoistCode){
            console.log('Todoist not found')
            const code = await new URLSearchParams(search).get('code');
            const state = await new URLSearchParams(search).get('state');
            if (code && state === todoistSecret){
                await fetch(`/api/users/todoistcode/${code}/${currentUser.uid}`, {
                    method: 'PUT'
                })
                await fetch(`https://todoist.com/oauth/access_token?client_id=${todoistClient}&client_secret=${todoistSecret}&code=${code}`, {
                    method: 'POST'
                })
                .then(response => response.json())
                .then(async data => {
                    if (data.access_token){
                        await fetch(`/api/users/todoisttoken/${data.access_token}/${currentUser.uid}`, {
                            method: 'PUT'
                        })
                    }
                })
        }
        }
    }

    const checkNotion = async () => {
        if (!userDB.notioncode){
            console.log('Notion not found')
            const code = new URLSearchParams(search).get('code');
            const state = new URLSearchParams(search).get('state');
            if (code && state === notionState){
                console.log('adding notioncode to user')
                await fetch(`/api/users/notioncode/${code}/${currentUser.uid}`, {
                    method: 'PUT'
                })  
                // const body = `{
                //     "grant_type": "authorization_code",
                //     "code": "${code}",
                //     "redirect_uri": "http://localhost:3000"
                // }`
                // console.log(body)
                // const auth = 'Basic ' + Buffer.from(notionClient + ":" + notionSecret).toString('base64');
                // console.log(auth)
                // await fetch(`https://api.notion.com/v1/oauth/token`, {
                //     method: 'POST',
                //     headers: {
                //         'Authorization': auth,
                //         'Content-Type': 'application/json'
                //     }, 
                //     body: body
                // })
                // .then(response => response.json())
                // .then(data => console.log(data))
            }
        }
    }

    // const checkOnedrive = async () => {
    //     if (!userDB.onedrivecode){
    //         console.log('OneDrive not found')
    //         const code = new URLSearchParams(search).get('code');
    //         const state = new URLSearchParams(search).get('state');
    //         if (code && state === onedriveState){
    //             console.log('adding onedrivecode to user')
    //             await fetch(`/api/users/onedrivecode/${code}/${currentUser.uid}`, {
    //                 method: 'PUT'
    //             })
    //         }
    //     }
    // }

    const createFlow = async () => {
        const flow = `${step1}-${step2}-Notion`
        const bod = `{
            "uid": "${userDB.id}",
            "flow": "${flow}",
            "active": false,
            "c": "${currentClass}"
        }`
        console.log(bod)
        await fetch('/api/flows/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: bod
        })
    }

    // const getAllFlows = async () => {
    //     if (surveyResponse.media = 'Digital Writing (iPad, Surface)'){
    //         let tasks
    //         let cloud
    //         if (surveyResponse.tools.indexOf('Todoist') !== -1){
    //             tasks = 'Todoist'
    //         }
    //         else {
    //             tasks = 'StudyTasks'
    //         }
    //         if (!(surveyResponse.cloud)) {
    //             await fetch(`/api/flows/nocloud/${surveyResponse.apporcloud}/${tasks}`)
    //             .then(response => response.json())
    //             .then(data => {
    //                 setFlowList(data)
    //             })
    //         }
    //         await fetch(`/api/flows/cloud/${surveyResponse.apporcloud}/${surveyResponse.cloud}/${tasks}`)
    //             .then(response => response.json())
    //             .then(data => {
    //                 setFlowList(data)
    //             })
    //     }
    //     console.log(classLoading)
    // }

    // const getCategory = (obj) => {
    //     console.log(obj)
    //     const cat = _.chain(obj).pick('tags').value().tags
    //     // .pick(['Notability', 'OneDrive']).values().join(' ').value()
    //     console.log(cat)
    //     return cat
    // }

    // const getFlows = async () => {
    //     await fetch('/api/flows')
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log(data)
    //         let firstGrouping = _.groupBy(data, (obj) => {
    //             return obj.tags[0]
    //         })
    //         console.log(firstGrouping)
    //         const groupingArray = []
    //         for (const property in firstGrouping){
    //             firstGrouping[property] =  _.groupBy(firstGrouping[property], (obj) => {
    //                     return obj.tags[1]
    //                 })
    //             for (const property2 in firstGrouping[property]){
    //                 firstGrouping[property][property2] =  _.groupBy(firstGrouping[property][property2], (obj) => {
    //                     return obj.tags[2]
    //                 })
    //             }
    //         }
    //         setFlowList(firstGrouping)
    //         console.log(firstGrouping)
            
    //     })
    //     .then((firstGrouping) => console.log(firstGrouping))
    // }

    // const setFlow = async (id) => {
    //     let userFlows = userDB.flows
    //     userFlows.splice(currentClassKey, 1, id)
    //     const bod = `{
    //         "flows": [${userFlows}],
    //         "uid": "${currentUser.uid}"
    //     }`
    //     await fetch('/api/users/flows/', {
    //         method: 'PUT',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: bod
    //     })
    //     .then(() => {
    //         setShowModal(false)
    //         setClassLoading(false)
    //     })
    // }

    // const filterFlows = (filters, difficulty) => {
    //     let tempFlows = flowObject
    //     for (let i=0; i<filters.length; i++) {
    //         tempFlows = tempFlows[filters[i]]
    //     }
    //     const tempFlowArr = Object.entries(tempFlows)
    //     let flowArr = []
    //     for (let i=0; i<tempFlowArr.length; i++) {
    //         const baseArr = Object.entries(tempFlowArr[i][1])
    //         for (let j=0; j<baseArr.length; j++){
    //             console.log(baseArr[j][1])
    //             flowArr.push(baseArr[j][1])
    //         }
    //     }
    //     flowArr = flowArr.flat()
    //     console.log(flowArr)
    //     if (difficulty !== 'Difficulty') {
    //         flowArr = flowArr.filter(flow => flow.difficulty === difficulty)
    //         console.log(flowArr)
    //     }
    //     setCustomFlow(flowArr)
    // }

    // const clearFilters = async () => {
    //     setMedia('Media')
    //     setCloud('Cloud Service')
    //     setDifficulty('Difficulty')
    //     setCustomFlow([])
    // }

    return (
        <div style={{ width: '1000px', margin: '0px auto' }} className='d-flex flex-column justify-content-center'>
            <h4 style={{ textAlign: 'center', margin: '20px' }}>Welcome, <span style={{ textTransform: 'capitalize' }}>{currentUser.displayName}</span> | {surveyResponse.grade} at {surveyResponse.college}</h4>
            <h4>Your Profile</h4>
            <ProfileCards />
            <h4>Your classes</h4>
            <div className="d-flex flex-column justify-content-center"> 
                {userDB.classes.map((c, i) => {
                    return <Class
                        class={userFlows[c].class}
                        id={userFlows[c].id}
                        active={userFlows[c].active} 
                        path={userFlows[c].path}
                    />
                })}
            </div>
        </div>
    )
}
