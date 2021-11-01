import React, { useContext, useState, useEffect } from 'react'
import _, { first } from 'underscore'
import { auth, googleProvider } from '../firebase.js';
import Spinner from 'react-bootstrap/Spinner'

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [userDB, setUserDB] = useState()
    const [surveyResponse, setSurveyReponse] = useState();
    const [flowList, setFlowList] = useState([]);
    const [flowObject, setFlowObject] = useState({})
    const [loading, setLoading] = useState(true);

    // function signup(email, password) {
    //     return auth.createUserWithEmailAndPassword(email, password);
    // }

    function googleSignup() {
        return auth.signInWithRedirect(googleProvider);
    }

    // function login(email, password) {
    //     return auth.signInWithEmailAndPassword(email, password);
    // }

    function logout() {
        return auth.signOut();
    }

    // function resetPassword(email) {
    //     return auth.sendPasswordResetEmail(email);
    // }

    // function updateEmail(email) {
    //     return currentUser.updateEmail(email);
    // }

    // function updateDisplayName(newDisplayName) {
    //     return currentUser.updateProfile({
    //         displayName: newDisplayName
    //     });
    // }

    // function updatePassword(password) {
    //     return currentUser.updatePassword(password)
    // }

    // function updatePhotoURL(url) {
    //     return currentUser.updateProfile({
    //         photoURL: url
    //     });
    // }

    function deleteUser() {
        return currentUser.delete();
    }

    function reauthenticate(credential) {
        return currentUser.reauthenticateWithCredential(credential);
    }

    const getSurveyReponse = async (user) => {
        try {
            await fetch(`/api/users/${user.uid}`)
                .then(response => response.json())
                .then(async data => {
                    await setUserDB(data[0])
                })
            await fetch(`/api/surveyresponses/${user.uid}`)
                .then(response => response.json())
                .then(async data => {
                    let d = data[0]
                    d.classesarray = JSON.parse('['+d.classesarray.slice(1, -1)+']')
                    await setSurveyReponse(d)
                })
        } catch (error) {
            setSurveyReponse(null)
        }
    }

    const getFlows = async () => {
        let firstGrouping = []
        await fetch('/api/flows')
            .then(response => response.json())
            .then(async data => {
                await setFlowList(data)
                firstGrouping = _.groupBy(data, (obj) => {
                    return obj.tags[0]
                })
                for (const property in firstGrouping){
                    firstGrouping[property] =  _.groupBy(firstGrouping[property], (obj) => {
                            return obj.tags[1]
                        })
                    for (const property2 in firstGrouping[property]){
                        firstGrouping[property][property2] =  _.groupBy(firstGrouping[property][property2], (obj) => {
                            return obj.tags[2]
                        })
                    }
                }
            })
            .then(async () => {
                await setFlowObject(firstGrouping)
            })
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async user => {
            await setCurrentUser(user);
            await getSurveyReponse(user);
            await getFlows()
            setLoading(false)
        })

        return unsubscribe;
    }, [])

    const value = {
        currentUser,
        //signup,
        googleSignup,
        //login,
        logout,
        //resetPassword,
        //updateEmail,
        //updateDisplayName,
        //updatePassword,
        //updatePhotoURL,
        deleteUser,
        reauthenticate,
        userDB,
        surveyResponse,
        flowList,
        flowObject
    }

    if (loading) {
        return (
            <div style={{marginTop: '20%'}} className="d-flex justify-content-center">
                <div className="d-flex flex-column align-items-center">
                    <h3 style={{marginBottom: '15px'}}><strong>studyflow.ai</strong></h3>
                    <Spinner animation="border" variant="dark" />
                </div>
            </div>
        )
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}