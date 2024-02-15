// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyC3m5EJw5wrU60UHIXzGNnWFLOPkxER8Wo',
  authDomain: 'p2px-57624.firebaseapp.com',
  projectId: 'p2px-57624',
  storageBucket: 'p2px-57624.appspot.com',
  messagingSenderId: '866167025395',
  appId: '1:866167025395:web:43aebacea106479cf21186',
  measurementId: 'G-NKQME8R0C6',
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Set up Google authentication provider
const googleProvider = new GoogleAuthProvider();
// Add additional scopes to request more user information
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');

// Sign in with Google
const signInWithGoogle = () => {
  auth
    .signInWithPopup(googleProvider)
    .then((result) => {
      // Handle successful sign-in
      const user = result.user;
      console.log('User profile:', user);
    })
    .catch((error) => {
      // Handle errors
      console.error('Error signing in with Google:', error);
    });
};

export { auth, db, signInWithGoogle };
