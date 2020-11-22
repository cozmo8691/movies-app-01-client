import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API } from "aws-amplify";
import { Fade } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";

export default function Home() {
  const [ratings, setRatings] = useState([]);
  const { isAuthenticated, setHasRatings } = useAppContext();
  const [isLoadingRatings, setIsLoadingRatings] = useState(true);
  const [isLoadingMovies, setIsLoadingMovies] = useState(true);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    if (!ratings.length) {
      return;
    }

    const promises = ratings.map(({ movieId }) =>
      API.get("movies", `/movie/${movieId}/`)
    );
    async function getMovies() {
      try {
        const movies = await Promise.all(promises);
        setMovies(movies);
      } catch (e) {
        onError(e);
      } finally {
        setIsLoadingMovies(false);
      }
    }
    getMovies();
  }, [ratings]);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const ratings = await loadRatings();
        setRatings(ratings);
        const hasRatings = ratings.length > 0;
        setHasRatings(hasRatings);
        if (!hasRatings) {
          setIsLoadingMovies(false);
        }
      } catch (e) {
        onError(e);
      } finally {
        setIsLoadingRatings(false);
      }
    }

    onLoad();
  }, [isAuthenticated, setHasRatings]);

  function loadRatings() {
    return API.get("movies", "/ratings");
  }

  function renderRatingsList() {
    return (
      <div className="home-movies-list">
        <h1>Your ratings</h1>
        <Fade in={true} appear>
          <ul>
            {movies.length > 0 &&
              movies.map(({ id, poster_path }) => {
                const rating = ratings.find((r) => r.movieId === id.toString())
                  .rating;
                return (
                  <li
                    key={id}
                    style={{
                      position: "relative",
                    }}>
                    <div
                      onClick={() => {}}
                      style={{
                        backgroundImage: `url(https://image.tmdb.org/t/p/w342/${poster_path})`,
                      }}
                    />
                    <span className="rating-value">
                      {[...Array(rating)].map((_el, i) => (
                        <span key={i} style={{ padding: "3px" }}>
                          &#11088;
                        </span>
                      ))}
                    </span>
                  </li>
                );
              })}
          </ul>
        </Fade>
        {!isLoadingRatings && !isLoadingMovies && movies.length === 0 && (
          <div>
            <Link to="/movies">Go rate some movies</Link> to get recommendations
          </div>
        )}
      </div>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Movie stuff</h1>
        <p>Get some movie recommendations</p>
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

  return (
    <div className="Home">
      {isAuthenticated ? renderRatingsList() : renderLander()}
    </div>
  );
}
