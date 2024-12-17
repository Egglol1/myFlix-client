import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { MovieCard } from "../movie-card/movie-card";

export const FavoriteMovies = ({ user, favoriteMovies, handleFavoriteToggle, favoriteMovieList }) => {
  return (
    <>
      <Container>
      <Row className="justify-content-md-center mt-5">
        <Col className="text-center">
          <h2>Your Favorite Movies</h2>
        </Col>
      </Row>
      <Row className="justify-content-md-center mt-5">
        {favoriteMovieList.map((movie) => (
          <Col className="mb-5" key={movie.id} xs = {12} md={6} lg={3}>
            <MovieCard
              movie={movie}
              isFavorite={favoriteMovies.includes(String(movie.id))} // Assumes favoriteMovies is an array of movie IDs
              onFavoriteToggle={handleFavoriteToggle}
              username={user.username}
            />
          </Col>
        ))}{" "}
      </Row>
      </Container>
    </>
  );
}