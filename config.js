import firebase from 'firebase';
//require ("@firebase/firestore")


const firebaseConfig = {
  apiKey: "AIzaSyCun_nquaFmIGEfM8DmMH5RpGi0hQczTdA",
  authDomain: "willyapp-d6917.firebaseapp.com",
  databaseURL: "https://willyapp-d6917.firebaseio.com",
  projectId: "willyapp-d6917",
  storageBucket: "willyapp-d6917.appspot.com",
  messagingSenderId: "371584721479",
  appId: "1:371584721479:web:8fffe07895df49137f8762"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();