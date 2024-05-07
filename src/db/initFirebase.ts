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

const initFirebase = async (username: string, password: string) => {
  try {
const apiKey = import.meta.env.VITE_API_KEY??"";
const projectId = import.meta.env.VITE_PROJECT_ID??"";

const firebaseConfig = {
  projectId: projectId,
  apiKey: apiKey
};

console.log(import.meta)

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

      return signInWithCredential(
        auth,
        EmailAuthProvider.credential("dev@osiris.com", "1234567890")
      ).then((res) => {
        const user = res.user;
        sessionStorage.setItem("user", user.uid);
        return "success";

      }).catch(() => {
        console.log("Failed to authenticate with user: " + "dev@osiris.com");
        return "failed";

      })
    } else {
      return signInWithCredential(
        auth,
        EmailAuthProvider.credential(username, password)
      ).then((res) => {
        const user = res.user;
        sessionStorage.setItem("user", user.uid);
        return "success";
      }).catch(() => {
        console.log("Failed to authenticate with user: " + username);
        return "failed";
      })

    }
  } catch (err) {
    return "failed";
  }
}

export default initFirebase
