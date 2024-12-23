import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";
import React, {useState} from "react";
import { Link } from "react-router-dom";

import "./movie-card.scss";

export const MovieCard = ({ movie, isFavorite, onFavoriteToggle }) => {
  const [isFav, setIsFav] = useState(isFavorite);

  const handleFavoriteClick = () => {
    setIsFav(prev => !prev);
    onFavoriteToggle(movie._id, !isFav);
  };

  return (
    <Card clasName="h-100">
      <Card.Img variant="top" src={movie.image} />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>{movie.author}</Card.Text>
        <Link to={`/movies/${encodeURIComponent(movie.id)}`}>
          <Button variant="link">Open</Button>
        </Link>
        <Button
          variant={isFav ? "danger" : "secondary"}
          onClick={handleFavoriteClick}
        >
          {isFav ? "Unfavorite" : "Favorite"}
        </Button>
      </Card.Body>
    </Card>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    director: PropTypes.string
  }).isRequired,
  isFavorite: PropTypes.bool.isRequired,
  onFavoriteToggle: PropTypes.func.isRequired
};