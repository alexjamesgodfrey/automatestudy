import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/storage';

let google = new firebase.auth.GoogleAuthProvider();

const app = firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
});

export const googleProvider = google;

export const auth = app.auth();
export default app;