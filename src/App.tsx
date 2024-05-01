import { useEffect, useState } from 'react';
import Home from './Pages/Home';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import initFirebase from './db/initFirebase';
import { Container, Row, Col, Input, Button } from "reactstrap";

const App = () => {
  const [ready, setReady] = useState(false);
  const [hasSignedIn, setHasSignedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signInErr, setSignInErr] = useState("");

  const signIn = () => {
    // Subscribe to firebase auth
    initFirebase(username, password).then((db) => {
      onAuthStateChanged(getAuth(), resultUser => {
        if (resultUser == null) {
          console.log("FAILED TO AUTHENTICATE USER FOR DB", db)
          setReady(true);
          setHasSignedIn(true);
        } else {
          console.log("AUTH USER: ", resultUser);
          setReady(true);
          setHasSignedIn(true);
        }
      });
    }).catch((err) => {
      setSignInErr("Incorrect Username or Password");
    })
  }

  const renderSignIn = () => {
    return (
      <Row className="p-4">
        <h1 style={{color: "white"}}>Please sign in to continue</h1>
        <Col md={6} sm={12}>
          <strong style={{color: "white"}}>Username:</strong><br />
          <Input type="text" value={username} onChange={(e) => setUsername(e.currentTarget.value)} />
        </Col>
        <Col md={6} sm={12}>
          <strong style={{color: "white"}}>Password:</strong><br />
          <Input type="password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} />
        </Col>
        <Col md={12}>
          <Row>
            {
              signInErr ?
              <br/> : null

            }
            <Col align="center"><p style={{color: "red"}}> {signInErr}</p></Col>
          </Row>
        </Col>
        <Col md={12}>
          <Row className="mt-2">
            <Col align="right"><Button onClick={() => {signIn()}}>Sign In</Button></Col>
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
