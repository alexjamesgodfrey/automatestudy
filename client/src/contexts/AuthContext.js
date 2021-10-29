import React, { useContext, useState, useEffect } from 'react'
import { auth, googleProvider } from '../firebase.js';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [userDB, setUserDB] = useState()
    const [surveyResponse, setSurveyReponse] = useState();
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
                    setLoading(false)
                })
        } catch (error) {
            setSurveyReponse(null)
            return setLoading(false)
        }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            getSurveyReponse(user);
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
        surveyResponse
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}