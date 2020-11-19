import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";
// import { Modal, Button } from "react-bootstrap";

import "./Calendar.css";

export default function Calendar() {
  const [movieDetails, setMovieDetails] = useState(null);

  useEffect(() => {
    async function getMovies() {
      try {
        const result = await API.get("movies", `/movie/5255/`);
        setMovieDetails(result);
      } catch (e) {
        alert(e);
      }
    }
    getMovies();
  }, []);

  return (
    <div className="movies-list">
      <ul>list of 25 movies</ul>
      {movieDetails && <div>title: {movieDetails.original_title}</div>}
    </div>
  );
}
