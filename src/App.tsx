import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, NavItem, Button } from "react-bootstrap";

import Routes from "./Routes";
import { AppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";

import "./App.css";

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [hasRatings, setHasRatings] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [isViewingMovies, setIsViewingMovies] = useState(false);
  const [displayUserName, setDisplayUserName] = useState("");
  const history = useHistory();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    async function getUserInfo() {
      const {
        attributes: { email },
      } = await Auth.currentUserInfo();
      setDisplayUserName(email);
    }

    getUserInfo();
  }, [isAuthenticated]);

  useEffect(() => {
    async function onLoad() {
      try {
        const res = await Auth.currentSession();
        console.log(res);
        userHasAuthenticated(true);
      } catch (e) {
        console.log("ERROR", e);
        if (e !== "No current user") {
          onError(e);
        }
      }

      setIsAuthenticating(false);
    }

    onLoad();
  }, []);

  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);
    history.push("/login");
  }

  if (isAuthenticating) {
    return null;
  }

  return (
    <div className="App container">
      <Navbar bg="light" expand="lg">
        <LinkContainer to="/">
          <NavItem className="brand">Movie stuff 123</NavItem>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto justify-content-end">
            {isAuthenticated ? (
              <>
                <div>{displayUserName}</div>
                <Nav.Item onClick={handleLogout}>Logout</Nav.Item>
              </>
            ) : (
              <>
                <LinkContainer to="/signup">
                  <NavItem>Signup</NavItem>
                </LinkContainer>
                <LinkContainer to="/login">
                  <NavItem>Login</NavItem>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <AppContext.Provider
        value={{
          isAuthenticated,
          userHasAuthenticated,
          hasRatings,
          setHasRatings,
          showFilter,
          setShowFilter,
          setIsViewingMovies,
        }}>
        <Routes />
      </AppContext.Provider>
      {isAuthenticated && (
        <div className="global-buttons">
          {isViewingMovies && (
            <Button variant="success" onClick={() => setShowFilter(true)}>
              Filter movies
            </Button>
          )}
          {!isViewingMovies && (
            <LinkContainer to="/movies">
              <Button variant="success">Rate some movies</Button>
            </LinkContainer>
          )}
          {hasRatings && (
            <LinkContainer to="/recommendations">
              <Button variant="primary">Get recommendations</Button>
            </LinkContainer>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
