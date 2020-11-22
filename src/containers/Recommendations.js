import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { Modal, Button, Spinner, Fade } from "react-bootstrap";

import "./Recommendations.css";
import { onError } from "../libs/errorLib";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [movies, setMovies] = useState([]);
  const [detailMovieId, setDetailMovieId] = useState(null);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const nextMovie = detailMovieId
      ? movies.find((m) => m.id === detailMovieId)
      : null;
    setCurrentMovie(nextMovie);
  }, [detailMovieId, movies]);

  useEffect(() => {
    async function getRecommendations() {
      try {
        const result = await API.get("movies", `/recommendations/`);
        // const filteredRecommendations = result
        //   .filter((r) => r.score > 0)
        //   .map((r) => ({ ...r, percent: (r.score / 5) * 100 }));
        setRecommendations(result);
      } catch (e) {
        onError(e);
      }
    }
    getRecommendations();
  }, []);

  useEffect(() => {
    const promises = recommendations.map(({ movieId }) =>
      API.get("movies", `/movie/${movieId}/`)
    );
    async function getMovies() {
      try {
        const movies = await Promise.all(promises);
        setMovies(movies);
      } catch (e) {
        onError(e);
      } finally {
        setIsFetching(false);
      }
    }
    getMovies();
  }, [recommendations]);

  if (isFetching) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" variant="secondary" />
      </div>
    );
  }

  return (
    <div className="movies-list">
      <h2>Recommendations:</h2>
      <Fade in={true} appear>
        <ul>
          {movies.map(({ id, poster_path }) => {
            return (
              <li key={id}>
                <div
                  onClick={() => setDetailMovieId(id)}
                  style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/w342/${poster_path})`,
                  }}>
                  {recommendations.find((r) => r.movieId === id)}%
                </div>
              </li>
            );
          })}
        </ul>
      </Fade>

      {currentMovie && (
        <Modal
          show={!!currentMovie}
          onHide={() => setDetailMovieId(null)}
          className="movieDetailsModal">
          <Modal.Header
            closeButton
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/w342/${currentMovie.backdrop_path})`,
              backgroudSize: "cover",
            }}>
            <Modal.Title>{currentMovie.original_title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{currentMovie.overview}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setDetailMovieId(null)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
