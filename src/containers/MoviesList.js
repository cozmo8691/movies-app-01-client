import React, { useState } from "react";
import { API } from "aws-amplify";
import { Modal, Button } from "react-bootstrap";

import { useInfiniteScroll } from "../libs/hooksLib";

import "./MoviesList.css";

export default function MoviesList() {
  const [data, setData] = useState({ results: [] });
  const [show, setShow] = useState(false);
  const [movieId, setMovieId] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);

  // const MOVIE_API_URL = 'http://localhost:3000/movies';

  const [
    isFetching,
    setIsFetching,
    pageIndex,
    setPageIndex,
    genre,
  ] = useInfiniteScroll(() => {
    const fetchData = async () => {
      setIsFetching(() => false);
      const result = await API.get("movies", `/movies/${pageIndex}/${genre}`);
      setData(() => ({
        results: [...data.results, ...result.results],
      }));
      setPageIndex(pageIndex + 1);
    };
    fetchData();
  });

  const handleClose = (id) => {
    setShow(false);
    setMovieId(null);
    setMovieDetails(null);
  };

  const handleShow = (id) => {
    setMovieDetails(null);
    getMovieDetails(id);
    setShow(true);
    setMovieId(id);
  };

  // "{\"rating\":5,\"movieId\":\"abc123\"}"
  function createRating(content) {
    return API.post("movies", "/ratings", {
      body: content,
    });
  }

  async function handleSubmit(rating, movieId) {
    // setIsLoading(true);

    try {
      await createRating({ rating, movieId: `${movieId}` });
    } catch (e) {
      alert(e);
    } finally {
      setShow(false);
      // setIsLoading(false);
    }
  }

  async function getMovieDetails(movieId) {
    try {
      const result = await API.get("movies", `/movie/${movieId}/`);
      setMovieDetails(result);
    } catch (e) {
      alert(e);
    }
  }

  return (
    <div className="movies-list">
      <ul>
        {data.results.map((item) => (
          <li key={item.id}>
            <div
              onClick={() => handleShow(item.id)}
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/w342/${item.poster_path})`,
              }}
            />
          </li>
        ))}
      </ul>

      {movieDetails && (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header
            closeButton
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/w342/${movieDetails.backdrop_path})`,
              backgroudSize: "cover",
            }}>
            <Modal.Title>{movieDetails.original_title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{movieDetails.overview}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => handleSubmit(1, movieId)}>
              1 star
            </Button>
            <Button variant="primary" onClick={() => handleSubmit(2, movieId)}>
              2 stars
            </Button>
            <Button variant="primary" onClick={() => handleSubmit(3, movieId)}>
              3 stars
            </Button>
            <Button variant="primary" onClick={() => handleSubmit(4, movieId)}>
              4 stars
            </Button>
            <Button variant="primary" onClick={() => handleSubmit(5, movieId)}>
              5 stars
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {isFetching && "Fetching more list items..."}
    </div>
  );
}
