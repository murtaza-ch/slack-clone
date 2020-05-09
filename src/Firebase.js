import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
    apiKey: "AIzaSyD4VSfRWFbGtBLfTPPd8WO73k9B8Crvlts",
    authDomain: "react-slack-clone-4f54f.firebaseapp.com",
    databaseURL: "https://react-slack-clone-4f54f.firebaseio.com",
    projectId: "react-slack-clone-4f54f",
    storageBucket: "react-slack-clone-4f54f.appspot.com",
    messagingSenderId: "583952480071",
    appId: "1:583952480071:web:0df958b35e4973ba46fe62",
    measurementId: "G-50H9PQ3KZN"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;