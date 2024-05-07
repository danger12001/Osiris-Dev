import { useEffect, useState } from 'react';
import Home from './Pages/Home';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import initFirebase from './db/initFirebase';
import { Container, Row, Col, Input, Button } from "reactstrap";
import { initializeApp } from 'firebase/app';

const App = () => {
  const [ready, setReady] = useState(false);
  const [hasSignedIn, setHasSignedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signInErr, setSignInErr] = useState("");
  const apiKey = import.meta.env.VITE_API_KEY??"";
  const projectId = import.meta.env.VITE_PROJECT_ID??"";
  const firebaseConfig = {
    projectId: projectId,
    apiKey: apiKey
  };

  useEffect(() => {
    if (sessionStorage.getItem("user")) {
      initializeApp(firebaseConfig);
      setReady(true);
      setHasSignedIn(true);
    } else {
        console.log(import.meta)
      if(import.meta.env.VITE_NODE_ENV !== "production") {
        initFirebase("", "").then((db) => {
          if (db !== "failed") {
            onAuthStateChanged(getAuth(), resultUser => {
              if (resultUser == null) {
                console.log("FAILED TO AUTHENTICATE USER FOR DB", db)
                setReady(false);
                setHasSignedIn(false);
              } else {
                console.log("AUTH USER: ", resultUser);
                setReady(true);
                setHasSignedIn(true);
              }
            });
          } else {
            setReady(false);
            setHasSignedIn(false);
            setSignInErr("Incorrect Username or Password");
    
          }
        }).catch((err) => {
          setSignInErr("Incorrect Username or Password");
        })
      }
    }
  }, [])


  const signIn = () => {
    // Subscribe to firebase auth
    initFirebase(username, password).then((db) => {
      if (db !== "failed") {
        onAuthStateChanged(getAuth(), resultUser => {
          if (resultUser == null) {
            console.log("FAILED TO AUTHENTICATE USER FOR DB", db)
            setReady(false);
            setHasSignedIn(false);
          } else {
            console.log("AUTH USER: ", resultUser);
            setReady(true);
            setHasSignedIn(true);
          }
        });
      } else {
        setReady(false);
        setHasSignedIn(false);
        setSignInErr("Incorrect Username or Password");

      }
    }).catch((err) => {
      setSignInErr("Incorrect Username or Password");
    })
  }

  const renderSignIn = () => {
    return (
      <Row className="p-4">
        <h1 style={{ color: "white" }}>Please sign in to continue</h1>
        <Col md={6} sm={12}>
          <strong style={{ color: "white" }}>Username:</strong><br />
          <Input type="text" value={username} onChange={(e) => setUsername(e.currentTarget.value)} />
        </Col>
        <Col md={6} sm={12}>
          <strong style={{ color: "white" }}>Password:</strong><br />
          <Input type="password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} />
        </Col>
        <Col md={12}>
          <Row>
            {
              signInErr ?
                <br /> : null

            }
            <Col align="center"><p style={{ color: "red" }}> {signInErr}</p></Col>
          </Row>
        </Col>
        <Col md={12}>
          <Row className="mt-2">
            <Col align="right"><Button onClick={() => { signIn() }}>Sign In</Button></Col>
          </Row>
        </Col>
      </Row>
    )
  }

  return (
    <Container className="" fluid={true}>

      {hasSignedIn ? ready ?
        <Home /> :
        "APP will redirect once database is initialized" : renderSignIn()
      }
    </Container>
  )
}

export default App
