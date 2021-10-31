import React from 'react'
import Badge from 'react-bootstrap/Badge'
import notability from '../../images/notability.png'
import onedrive from '../../images/onedrive.svg'
import notion from '../../images/notion.svg'
import check from '../../images/check.svg'
import arrowRight from '../../images/arrowright.svg'

export default function Flows(props) {
    const arrow =  <img src={arrowRight} className="icon" style={{ width: '50px'}} alt="arrow facing right" />
    const setFlow = async (id) => {
        let userFlows = props.user.flows
        console.log(userFlows)
        console.log(props.classIndex)
        userFlows.splice(props.classIndex, 0, id)
        console.log(userFlows)
        const bod = `{
            "flows": [${userFlows}],
            "uid": "${props.user.uid}"
        }`
        console.log(bod)
        await fetch('/api/users/flows/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: bod
        })
    }

    return (
        <div>
            {props.flowList.map((flow, key) => {
                return (
                    <div onClick={() => setFlow(flow.id)} style={{border: '2px solid lightgrey', borderRadius: '1%', padding: '10px', margin: '15px 0px', cursor: 'pointer', }}>
                        <p>
                            {flow.recommended ? <strong>Recommended ({flow.difficulty}) </strong> : <strong>{flow.difficulty} </strong>}
                            {flow.description}
                        </p>
                        <div className="d-flex align-items-start justify-content-center">
                            {flow.tags.indexOf('Notability') !== -1 ?
                                <div className="d-flex align-items-center">
                                    <img style={{ width: '50px'}} src={notability} alt="notability icon" />
                                    {arrow}
                                </div>
                                :<span>test</span>
                            }
                            {flow.tags.indexOf('OneDrive') in flow.tags ?
                                <div className="d-flex align-items-center">
                                    <img style={{ width: '50px'}} src={onedrive} alt="onedrive icon" />
                                    {arrow}
                                </div>
                                :<span></span>
                            }
                            {flow.tags.indexOf('Notion') !== -1 ? 
                                <div className="d-flex align-items-center">
                                    <img style={{ width: '45px', marginTop: '2px'}} src={notion} alt="notion icon" />
                                    {arrow}
                                </div>
                                :<span></span>
                            }
                            {flow.tags.indexOf('StudyTasks') !== -1 ? 
                                <div className="d-flex flex-column align-items-center">
                                    <img style={{ width: '45px', margin: '2px 3px 0px 0px' }} src={check} alt="checkbox icon" />
                                </div>
                                :<span></span>
                            }
                        </div>
                        <div className="d-flex justify-content-center align-items-centers">
                            {flow.tags.map((tag, key) => {
                                return <Badge style={{margin: '7px 5px 0px 5px'}} variant="primary">{tag}</Badge>
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
