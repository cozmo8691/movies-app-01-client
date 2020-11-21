import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API } from "aws-amplify";
import { ListGroup } from "react-bootstrap";
// import { LinkContainer } from "react-router-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";

export default function Home() {
  const [ratings, setRatings] = useState([]);
  const { isAuthenticated, setHasRatings } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const ratings = await loadRatings();
        setRatings(ratings);
        setHasRatings(ratings.length > 0);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated, setHasRatings]);

  function loadRatings() {
    return API.get("movies", "/ratings");
  }

  function renderRatingsList(ratings) {
    // <p>Step 1: rate some movies so we know what you like.</p>
    //     <p>
    //       Step 2: get movie recommendations base on what similar users like.
    //     </p>

    return [{}].concat(ratings).map((rating, i) => (
      <ListGroup.Item key={rating.createdAt} header={rating.rating}>
        {"Movie: " + rating.movieId},
        {"Created: " + new Date(rating.createdAt).toLocaleString()}
      </ListGroup.Item>
    ));
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

  function renderRatings() {
    return (
      <div className="notes">
        <h1>Your Reviews</h1>
        <ListGroup>{!isLoading && renderRatingsList(ratings)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderRatings() : renderLander()}
    </div>
  );
}
