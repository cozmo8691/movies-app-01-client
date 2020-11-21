import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { Modal, Button, Spinner, Fade, Form } from "react-bootstrap";

import { useAppContext } from "../libs/contextLib";
import { useInfiniteScroll } from "../libs/hooksLib";

import "./MoviesList.css";

const genresDefinitions = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];

export default function MoviesList() {
  const [movies, setMovies] = useState([]);
  const { showFilter, setShowFilter, setIsViewingMovies } = useAppContext();
  const [show, setShow] = useState(false);
  const [movieId, setMovieId] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [genres, setGenres] = useState(genresDefinitions);
  const [isReset, setIsReset] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    setIsViewingMovies(true);

    return () => setIsViewingMovies(false);
  }, [setIsViewingMovies]);

  const [setCanFetch, pageIndex, setPageIndex] = useInfiniteScroll(() => {
    const fetchData = async () => {
      setIsFetching(true);
      const genreParams = Object.values(genres).reduce(
        (acc, { filter, id }) => {
          return filter ? [...acc, id] : acc;
        },
        []
      );

      const { results } = await API.get(
        "movies",
        `/movies/${pageIndex}/${genreParams.join(",")}`
      );

      const nextMovies = [...movies, ...results].reduce((acc, curr) => {
        if (acc.find((m) => m.id === curr.id)) {
          return acc;
        }
        return [...acc, curr];
      }, []);

      setMovies(nextMovies);
      setPageIndex(pageIndex + 1);
      setIsFetching(false);
    };
    fetchData();
  });

  useEffect(() => {
    if (!isReset) {
      return;
    }
    setMovies([]);
    setCanFetch(true);
    setPageIndex(1);
    setIsReset(false);
  }, [isReset, setPageIndex, setCanFetch]);

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

  async function handleSubmit(rating, movieId) {
    // setIsLoading(true);

    try {
      await API.post("movies", "/ratings", {
        body: { rating, movieId: `${movieId}` },
      });
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

  function handleCheck({ target: { value, checked } }) {
    const nextGenres = genres.map((genre) => {
      return genre.id.toString() === value
        ? { ...genre, filter: checked }
        : genre;
    });
    setGenres(nextGenres);
  }

  return (
    <div className="movies-list">
      {movies.length > 0 && (
        <Fade in={true} appear>
          <ul>
            {movies.map(({ id, poster_path }) => (
              <li key={id}>
                <div
                  onClick={() => handleShow(id)}
                  style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/w342/${poster_path})`,
                  }}
                />
              </li>
            ))}
          </ul>
        </Fade>
      )}

      {showFilter && (
        <Modal
          show={showFilter}
          onHide={() => setShowFilter(false)}
          className="filterModal">
          <Modal.Header closeButton>
            <Modal.Title>Filter movies</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {genres.map(({ name, id, filter }) => {
                return (
                  <div key={id} className="mb-3">
                    <Form.Check
                      checked={!!filter}
                      type="checkbox"
                      label={name}
                      name={name}
                      value={id}
                      id={`genre-${name}`}
                      onChange={handleCheck}
                    />
                  </div>
                );
              })}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => {
                setShowFilter(false);
                setIsReset(true);
              }}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {movieDetails && (
        <Modal show={show} onHide={handleClose} className="movieDetailsModal">
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
      {isFetching && (
        <div className="spinner-container">
          <Spinner animation="border" variant="secondary" />
        </div>
      )}
    </div>
  );
}
