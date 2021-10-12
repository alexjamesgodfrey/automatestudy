import firebase from "firebase/compat/app";
import 'firebase/compat/auth';

let google = new firebase.auth.GoogleAuthProvider();

const app = firebase.initializeApp({
    apiKey: "AIzaSyCtYShWwWHTfjdshMOKw_fh1kfRnaqaCJw",
    authDomain: "automatestudy.firebaseapp.com",
    projectId: "automatestudy",
    storageBucket: "automatestudy.appspot.com",
    messagingSenderId: "428180239187",
    appId: "1:428180239187:web:0eda0c263ba0cd6b0927a6"
});

export const googleProvider = google;

export const auth = app.auth();
export default app;