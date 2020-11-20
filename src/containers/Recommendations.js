import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";
// import { Modal, Button } from "react-bootstrap";

import "./Recommendations.css";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function getRecommendations() {
      try {
        const result = await API.get("movies", `/recommendations/`);
        setRecommendations(result);
      } catch (e) {
        alert(e);
      }
    }
    getRecommendations();
  }, []);

  useEffect(() => {
    const promises = recommendations.map(({ movieId }) =>
      API.get("movies", `/movie/${movieId}/`)
    );
    async function getMovies() {
      Promise.all(promises).then((movies) => {
        setMovies(movies);
      });
    }
    getMovies();
  }, [recommendations]);

  return (
    <div className="movies-list">
      <h2>Recommendations:</h2>
      <ul>
        {movies.map(({ id, poster_path }) => {
          return (
            <li key={id}>
              <div
                onClick={() => {}}
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/w342/${poster_path})`,
                }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
