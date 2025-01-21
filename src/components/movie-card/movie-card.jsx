import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";
import React, {useState} from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

export const MovieCard = ({ movie, handleAddFavorite, handleRemoveFavorite, isFavorite }) => {

  const movieId = useParams();
  const handleFavoriteToggle = () => {
    if (isFavorite) {
      handleRemoveFavorite(movie.id);
    } else {
      handleAddFavorite(movie.id);
    }
  };

  return (
    <Card className = "h-100">
      <Card.Img variant="top" src={movie.image} />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>{movie.author}</Card.Text>
        <Link to={`/movies/${encodeURIComponent(movie.id)}`}>
          <Button variant="link">Open</Button>
        </Link>
        <Button 
        variant={isFavorite ? "danger" : "primary"}
        onClick={handleFavoriteToggle}>
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"} 
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
  handleAddFavorite: PropTypes.func.isRequired,
  handleRemoveFavorite: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool.isRequired,
};