import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Card from 'react-bootstrap/Card'
import Survey from './Survey'
import Main from './Main'
import Test from './Test'

export default function LoggedIn() {
    const { currentUser, surveyResponse } = useAuth()
    const [userInfo, setUserInfo] = useState()
    const [takenSurvey, setTakenSurvey] = useState(surveyResponse)

    const createUser = async () => {
        try {
            const here = await fetch(`/api/users/${currentUser.uid}`)
            const hereJSON = await here.json()
            if (hereJSON.length === 0) {
                const user = `{
                    "displayname": "${currentUser.displayName}",
                    "email": "${currentUser.email}",
                    "photourl": "${currentUser.photoURL}",
                    "uid": "${currentUser.uid}"
                }`
                console.log('adding user to database')
                await fetch('/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: user
                })
            }
        } catch (error) {}
    }

    const submitSurvey = async bod => {
        console.log(bod)
        await fetch('/api/surveyresponses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: bod
        })
        .then(response => response.json)
        .then(data => console.log(data))
    }
    
    const bod = {
        "event_id": "01FKBSJK3DC6RHNJFBND44P2K1",
        "event_type": "form_response",
        "form_response": {
          "form_id": "k6G9ENWE",
          "token": "5r51ez7xop2j5lb5r51env0wre1xsp62",
          "landed_at": "2021-10-31T18:24:44Z",
          "submitted_at": "2021-10-31T18:25:20Z",
          "hidden": {
            "email": "alexjamesgodfrey@gmail.com",
            "name": "alex godfrey",
            "uid": "dtI44zsG0uWGDC5Vs5NiKFucfue2"
          },
          "definition": {
            "id": "k6G9ENWE",
            "title": "My typeform",
            "fields": [
              {
                "id": "aaNxecMPaFD7",
                "title": "Where are you currently learning?",
                "type": "multiple_choice",
                "ref": "8ea3dde5-a489-4afc-8940-7fb9e2d1577c",
                "properties": {},
                "choices": [
                  {
                    "id": "NrwzAwNUYnC3",
                    "label": "College/University"
                  },
                  {
                    "id": "5reLiB5bftxO",
                    "label": "High School"
                  },
                  {
                    "id": "QEggV5X1uS3T",
                    "label": "Autodidact"
                  }
                ]
              },
              {
                "id": "m9hDQGxQ9Rpq",
                "title": "What College/University do you attend?",
                "type": "dropdown",
                "ref": "e65e38ac-1f6f-4c9e-8a1b-ae957bf998b2",
                "properties": {}
              },
              {
                "id": "UgnOhh3Yhkp0",
                "title": "Hey Cornell Student :) Fun Fact: StudyFlow is made by a Cornell student. What college are you in?",
                "type": "multiple_choice",
                "ref": "299daa87-305d-409f-af73-91c9428f8560",
                "properties": {},
                "choices": [
                  {
                    "id": "Od0mLeCBDBbG",
                    "label": "A&S"
                  },
                  {
                    "id": "efo02Eo6Lfve",
                    "label": "COE"
                  },
                  {
                    "id": "GNroyqWAYHCX",
                    "label": "SHA"
                  },
                  {
                    "id": "42AHWk8QfDCW",
                    "label": "ILR"
                  },
                  {
                    "id": "AfwXjiFOJNsQ",
                    "label": "AAP"
                  },
                  {
                    "id": "9R4T8j6YiaUP",
                    "label": "Dyson"
                  },
                  {
                    "id": "AzW8TdIQp3WW",
                    "label": "CALS"
                  },
                  {
                    "id": "ypf9aF74L3Wi",
                    "label": "HumEc"
                  }
                ]
              },
              {
                "id": "Wgyf6l4HPNM5",
                "title": "What year are you?",
                "type": "multiple_choice",
                "ref": "54feb499-9d37-4324-a824-093feb86714f",
                "properties": {},
                "choices": [
                  {
                    "id": "yTgZDnvndkcm",
                    "label": "Freshman"
                  },
                  {
                    "id": "ZGyDbiQibvsa",
                    "label": "Sophomore"
                  },
                  {
                    "id": "JwkHDljGCBai",
                    "label": "Junior"
                  },
                  {
                    "id": "5RC1uNRfK5IT",
                    "label": "Senior"
                  },
                  {
                    "id": "HcIFzwH70cyU",
                    "label": "Graduate Student"
                  }
                ]
              },
              {
                "id": "IYULNYxDiwU9",
                "title": "How do you take notes?",
                "type": "multiple_choice",
                "ref": "90144303-a83f-47f2-8359-0d519b4bf0eb",
                "properties": {},
                "choices": [
                  {
                    "id": "eDSjEQNaJs3N",
                    "label": "Digital Writing (iPad, Surface)"
                  },
                  {
                    "id": "AgRaw9pVRduS",
                    "label": "Typed Notes (Macbook, Windows Laptop)"
                  },
                  {
                    "id": "Y8PHwwGruiYU",
                    "label": "Paper"
                  }
                ]
              },
              {
                "id": "2KLtoQvrmpZZ",
                "title": "What note-taking app do you use?",
                "type": "multiple_choice",
                "ref": "462f89bd-9535-4e50-950a-d8a77bed35f4",
                "properties": {},
                "choices": [
                  {
                    "id": "mfQzrKwAcGUA",
                    "label": "Notability"
                  },
                  {
                    "id": "4hn9N6gxaDe1",
                    "label": "Goodnotes"
                  },
                  {
                    "id": "Nat5pP2IyOeq",
                    "label": "OneNote iPad"
                  },
                  {
                    "id": "jifwANL7HTA9",
                    "label": "Other"
                  }
                ]
              },
              {
                "id": "cHJOHmEUotBQ",
                "title": "Does {{field:462f89bd-9535-4e50-950a-d8a77bed35f4}} automatically upload your notes to a cloud storage service? ",
                "type": "multiple_choice",
                "ref": "78229c69-d81e-43ae-bbda-ff863cfad3d3",
                "properties": {},
                "choices": [
                  {
                    "id": "cRZi6JML1kvz",
                    "label": "No"
                  },
                  {
                    "id": "DXEtj3VnbHcs",
                    "label": "OneDrive"
                  },
                  {
                    "id": "3wn8gVgCEeHJ",
                    "label": "Google Drive"
                  },
                  {
                    "id": "eTPks6dJAnFQ",
                    "label": "Other"
                  }
                ]
              },
              {
                "id": "S1DeiVqF46MZ",
                "title": "How many classes do you take notes for?",
                "type": "number",
                "ref": "04c6b629-a9a8-43d8-81b1-65adafae9b36",
                "properties": {}
              },
              {
                "id": "38n3iFSlXKCl",
                "title": "Class One",
                "type": "short_text",
                "ref": "342986a3-a981-4884-898e-5aed70ba9aca",
                "properties": {}
              },
              {
                "id": "N8lBlJsR2I48",
                "title": "Class Two",
                "type": "short_text",
                "ref": "da665c50-9935-4098-b2ce-6cc5e7b8fe74",
                "properties": {}
              },
              {
                "id": "thbY4FciqBSS",
                "title": "Class Three",
                "type": "short_text",
                "ref": "f4ff9c87-6807-4c17-8cb9-590dee150da9",
                "properties": {}
              },
              {
                "id": "5MIEWtz3CKZo",
                "title": "Which of the following productivity/study tools do you use?",
                "type": "multiple_choice",
                "allow_multiple_selections": true,
                "ref": "eac835ec-8a94-4857-96f6-d3b2e31396dd",
                "properties": {},
                "choices": [
                  {
                    "id": "DDWNMihwR7ku",
                    "label": "Notion"
                  },
                  {
                    "id": "wLGbR1NsTR8e",
                    "label": "Todoist"
                  },
                  {
                    "id": "0CF1v5CZ7W2S",
                    "label": "Microsoft To Do"
                  },
                  {
                    "id": "SwmR957qAwPW",
                    "label": "Google Tasks"
                  },
                  {
                    "id": "t9bAI9QN6SZi",
                    "label": "None of the above"
                  }
                ]
              }
            ]
          },
          "answers": [
            {
              "type": "choice",
              "choice": {
                "label": "College/University"
              },
              "field": {
                "id": "aaNxecMPaFD7",
                "type": "multiple_choice",
                "ref": "8ea3dde5-a489-4afc-8940-7fb9e2d1577c"
              }
            },
            {
              "type": "choice",
              "choice": {
                "label": "Cornell University"
              },
              "field": {
                "id": "m9hDQGxQ9Rpq",
                "type": "dropdown",
                "ref": "e65e38ac-1f6f-4c9e-8a1b-ae957bf998b2"
              }
            },
            {
              "type": "choice",
              "choice": {
                "label": "A&S"
              },
              "field": {
                "id": "UgnOhh3Yhkp0",
                "type": "multiple_choice",
                "ref": "299daa87-305d-409f-af73-91c9428f8560"
              }
            },
            {
              "type": "choice",
              "choice": {
                "label": "Freshman"
              },
              "field": {
                "id": "Wgyf6l4HPNM5",
                "type": "multiple_choice",
                "ref": "54feb499-9d37-4324-a824-093feb86714f"
              }
            },
            {
              "type": "choice",
              "choice": {
                "label": "Digital Writing (iPad, Surface)"
              },
              "field": {
                "id": "IYULNYxDiwU9",
                "type": "multiple_choice",
                "ref": "90144303-a83f-47f2-8359-0d519b4bf0eb"
              }
            },
            {
              "type": "choice",
              "choice": {
                "label": "Notability"
              },
              "field": {
                "id": "2KLtoQvrmpZZ",
                "type": "multiple_choice",
                "ref": "462f89bd-9535-4e50-950a-d8a77bed35f4"
              }
            },
            {
              "type": "choice",
              "choice": {
                "label": "OneDrive"
              },
              "field": {
                "id": "cHJOHmEUotBQ",
                "type": "multiple_choice",
                "ref": "78229c69-d81e-43ae-bbda-ff863cfad3d3"
              }
            },
            {
              "type": "number",
              "number": 3,
              "field": {
                "id": "S1DeiVqF46MZ",
                "type": "number",
                "ref": "04c6b629-a9a8-43d8-81b1-65adafae9b36"
              }
            },
            {
              "type": "text",
              "text": "MATH1120",
              "field": {
                "id": "38n3iFSlXKCl",
                "type": "short_text",
                "ref": "342986a3-a981-4884-898e-5aed70ba9aca"
              }
            },
            {
              "type": "text",
              "text": "CS1110",
              "field": {
                "id": "N8lBlJsR2I48",
                "type": "short_text",
                "ref": "da665c50-9935-4098-b2ce-6cc5e7b8fe74"
              }
            },
            {
              "type": "text",
              "text": "ASIAN2299",
              "field": {
                "id": "thbY4FciqBSS",
                "type": "short_text",
                "ref": "f4ff9c87-6807-4c17-8cb9-590dee150da9"
              }
            },
            {
              "type": "choices",
              "choices": {
                "labels": [
                  "Notion",
                  "Todoist"
                ]
              },
              "field": {
                "id": "5MIEWtz3CKZo",
                "type": "multiple_choice",
                "ref": "eac835ec-8a94-4857-96f6-d3b2e31396dd"
              }
            }
          ]
        }
      }

    useEffect(() => {
        createUser()
        //submitSurvey(JSON.stringify(bod))
    }, [])

    return (
        <div>
            {takenSurvey ? 
            <Main />
            :
            <div>
                <div style={{margin: '20px 20px' }} className="d-flex justify-content-center">
                    <Card style={{ width: '300px', margin: '15px' }}>
                        <Card.Header as="h5">Welcome, {currentUser.displayName}</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                Thanks for signing up. Take the getting started survey to begin.
                            </Card.Text>    
                        </Card.Body>
                    </Card>
                </div>
                <div className="d-flex justify-content-center"><Survey /></div>
            </div>
            }
            
        </div>
        
    )
}
