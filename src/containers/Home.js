import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import { API } from "aws-amplify";
import { ListGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";

export default function Home() {
  // const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        //const notes = await loadNotes();
        //setNotes(notes);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  // load reviews sf
  // function loadNotes() {
  //   return API.get("notes", "/notes");
  // }

  function renderNotesList(notes) {
    return [{}].concat(notes).map((note, i) =>
      i !== 0 ? (
        <LinkContainer key={note.noteId} to={`/notes/${note.noteId}`}>
          <ListGroup.Item>
            {`${note.content.trim().split("\n")[0]} - `}
            {"Created: " + new Date(note.createdAt).toLocaleString()}
          </ListGroup.Item>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/movies">
          <ListGroup.Item>
            <h4>
              <b>{"\uFF0B"}</b> Review some movies
            </h4>
          </ListGroup.Item>
        </LinkContainer>
      )
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Movie stuff</h1>
        <p>A simple movie recommender app</p>
        <div className="pt-3">
          <Link to="/login" className="btn btn-info btn-lg mr-3">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            Signup
          </Link>
        </div>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="notes">
        <h1>Your Reviews</h1>
        {/* <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup> */}
        <ListGroup>{!isLoading && renderNotesList([])}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}