import { useEffect, useState } from 'react';
import Home from './Pages/Home';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import initFirebase from './db/initFirebase';
import {Container} from "reactstrap";

const App = () => {
  const [ready, setReady] = useState(false);
  // Subscribe to firebase auth
  useEffect(
    () => {
      initFirebase().then((db) => {
        onAuthStateChanged(getAuth(), resultUser => {
          if(resultUser == null) {
            console.log("FAILED TO AUTHENTICATE USER FOR DB")
          } else {
            console.log("AUTH USER: ", resultUser);
            setReady(true);
          }
        });
      })
    },
    []
  )

  return (
    <Container fluid={true}>
      {ready ?
        <Home /> :
        "APP will redirect once database is initialized"
      }
    </Container>
  )
}

export default App
