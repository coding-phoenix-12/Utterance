import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import { getStorage } from "firebase/storage";


  
const firebaseConfig = {

    apiKey: "###",
  
    authDomain: "##",
  
    projectId: "##",
  
    storageBucket: "##",
  
    messagingSenderId: "##",
  
    appId: "###"
  
  };
  
  
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var provider = new firebase.auth.GoogleAuthProvider(); 

firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var storage = getStorage();



export {auth, provider, database, storage};
