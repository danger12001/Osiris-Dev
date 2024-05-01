import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  connectFirestoreEmulator,
  enableMultiTabIndexedDbPersistence
} from 'firebase/firestore';
import {
  getAuth,
  connectAuthEmulator,
  signInWithCredential,
  EmailAuthProvider,
  signOut
} from 'firebase/auth';

// the values to initialize the firebase app can be found in your firebase project
const firebaseConfig = {
  projectId: "osiris-ef879",
  apiKey: "AIzaSyCr8XOrwbDEbgOcTgqPCGeCokwmEmBQqu4"

}

const initFirebase = async (username: string, password: string) => {
  try {
    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    const auth = getAuth(app);

    if (process.env.NODE_ENV !== 'production') {
      // connectAuthEmulator(auth, 'http://localhost:9099')
      // connectFirestoreEmulator(firestore, 'localhost', 8080)
      enableMultiTabIndexedDbPersistence(firestore)
      /**
       * The following code logins the user automatically to speed up development.
       * For this to work you first need to create a user and then run the command
       * yarn emulator:export, then import the data when starting the emulator
       * yarn firebase emulators:start --only firestore,auth --import=firestore_mock_data
       */
      console.log(username, password)
      return signInWithCredential(
        auth,
        EmailAuthProvider.credential(username, password)
      ).then(() => {
        console.log("Logged in with user: " + username);
      }).catch(() => {
        console.log("Failed to authenticate with user: " + username);
      })
    } else {
      return signInWithCredential(
        auth,
        EmailAuthProvider.credential(username, password)
      ).then(() => {
        console.log("Logged in with user: " + username);

      }).catch(() => {
        console.log("Failed to authenticate with user: " + username);
      })
    }
  } catch (err) {
    console.error("error: " + err)
    return err
  }
}

export default initFirebase
