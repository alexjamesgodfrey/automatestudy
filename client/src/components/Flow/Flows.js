import React from 'react'
import FlowDisplay from './FlowDisplay'

export default function Flows(props) {
    const setFlow = async (id) => {
        let userFlows = props.user.flows
        userFlows.splice(props.classIndex, 1, id)
        const bod = `{
            "flows": [${userFlows}],
            "uid": "${props.user.uid}"
        }`
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
            <p>Choose a studyflow based on class difficulty (Easy/Average/Hard) and desired repetition count. </p>
            {props.flowList.map((flow, key) => {
                return (
                <div 
                    onClick={() => setFlow(flow.id)}
                    style={{ border: '2px solid lightgrey', padding: '10px', margin: '20px 0px', borderRadius: '1%', cursor: 'pointer'}}
                >
                    <FlowDisplay flow={flow} />
                </div>)
            })}
        </div>
    )
}
