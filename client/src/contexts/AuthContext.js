import React, { useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { auth, googleProvider } from '../firebase.js';
import Fade from 'react-bootstrap/Fade'
import { Checkmark } from 'react-checkmark'
import _, { first } from 'underscore'
import Spinner from 'react-bootstrap/Spinner'

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
    const search = useLocation().search

    const [currentUser, setCurrentUser] = useState();
    const [userDB, setUserDB] = useState()
    const [userFlows, setUserFlows] = useState()
    const [surveyResponse, setSurveyReponse] = useState();

    const [open, setOpen] = useState(false)
    const [userPresent, setUserPresent] = useState(false)
    const [loadingUserData, setLoadingUserData] = useState(true)
    const [loadingUserPreferences, setLoadingUserPreferences] = useState(true)
    const [loadingFlows, setLoadingFlows] = useState(true)
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

    function updateDisplayName(newDisplayName) {
        return currentUser.updateProfile({
            displayName: newDisplayName
        });
    }

    // function updatePassword(password) {
    //     return currentUser.updatePassword(password)
    // }

    function updatePhotoURL(url) {
        return currentUser.updateProfile({
            photoURL: url
        });
    }

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
                    await setUserDB(data)
                    await fetch(`/api/flows/user/${data.id}`)
                        .then(response => response.json())
                        .then(data => {
                            const flows = {}
                            for (let i = 0; i < data.length; i++) {
                                flows[data[i].class] = data[i]
                            }
                            setUserFlows(flows)
                            setLoadingFlows(false)
                        })
                    setLoadingUserData(false)
                })
            await fetch(`/api/surveyresponses/${user.uid}`)
                .then(response => response.json())
                .then(async data => {
                    let d = data[0]
                    d.classesarray = JSON.parse('['+d.classesarray.slice(1, -1)+']')
                    await setSurveyReponse(d)
                    setLoadingUserPreferences(false)
                })
        } catch (error) {
            setSurveyReponse(null)
        }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async user => {
            user ? setUserPresent(true) : setUserPresent(false)
            setOpen(true)
            await setCurrentUser(user);
            await getSurveyReponse(user);
            setTimeout(() => {setLoading(false)}, 1500)
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
        updateDisplayName,
        //updatePassword,
        updatePhotoURL,
        deleteUser,
        reauthenticate,
        userDB,
        userFlows,
        surveyResponse
    }

    if (loading && userPresent) {
        return (
            <Fade in={open}>
            <div style={{marginTop: '20%'}} className="d-flex justify-content-center">
                <div style={{ width: '300px' }} className="d-flex flex-column align-items-center">
                    <div className="d-flex flex-column">
                        <h3><strong>studyflow.ai</strong></h3> 
                        <strong style={{fontSize: '17px', textAlign: 'right', lineHeight: 0.75, marginBottom: '15px'}}>beta</strong>
                    </div>
                    <div style={{ width: '80%' }} className="d-flex justify-content-between">
                        <p>Loading user data</p>
                        {loadingUserData ? 
                            <Spinner style={{ marginTop: '4px' }} size="sm" animation="border" variant="dark" />
                        : 
                            <div><Checkmark style={{ margin: '4px' }} size='medium' color='#222529' /></div>
                        }
                    </div>
                    <div style={{ width: '80%' }} className="d-flex justify-content-between">
                        <p>Loading user preferences</p>
                        {loadingUserPreferences ? 
                            <Spinner style={{ marginTop: '4px' }} size="sm" animation="border" variant="dark" />
                        : 
                            <div><Checkmark style={{ marginTop: '4px' }} size='medium' color='#222529' /></div>
                        }
                        </div>
                    <div style={{ width: '80%' }} className="d-flex justify-content-between">
                        <p>Loading user's studyflows</p>
                        {loadingFlows ? 
                            <Spinner style={{ marginTop: '4px' }} size="sm" animation="border" variant="dark" />
                        : 
                            <div><Checkmark style={{ marginTop: '4px' }} size='medium' color='#222529' /></div>
                        }
                    </div>
                </div>
            </div>
            </Fade>
        )
    }

    if (loading) {
        return (
            <Fade in={open}>
            <div style={{marginTop: '20%'}} className="d-flex justify-content-center">
                <div style={{ width: '400px' }} className="d-flex flex-column align-items-center">
                    <h3 style={{marginBottom: '15px'}}><strong>welcome to studyflow.ai</strong></h3> 
                    <p className="mb-2 text-muted">automated workflow for students</p>
                </div>
            </div>
            </Fade>
        )
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}