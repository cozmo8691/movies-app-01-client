import React from "react";

import { BASE_POSTER_URL } from "../constants";

const RatingDisplay = ({ id, ratings }) => {
  const rating = ratings.find((r) => r.movieId === id.toString());

  if (!rating) {
    return null;
  }
  const { rating: ratingValue } = rating;

  return (
    <span className="rating-value">
      {[...Array(ratingValue)].map((_el, i) => {
        return (
          <span key={i} style={{ padding: "3px" }}>
            &#11088;
          </span>
        );
      })}
    </span>
  );
};

const Movie = ({ id, poster_path, ratings }) => {
  return (
    <li
      key={id}
      style={{
        position: "relative",
      }}>
      <div
        style={{
          backgroundImage: `url(${BASE_POSTER_URL}${poster_path})`,
        }}
      />
      <RatingDisplay id={id} ratings={ratings} />
    </li>
  );
};

export default Movie;
