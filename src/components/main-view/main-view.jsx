import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export const MainView = () => {
  console.log(localStorage.getItem("user"));
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [user, setUser] = useState(storedUser? storedUser : null);
  const [token, setToken] = useState(storedToken? storedToken : null);

  useEffect(() => {
    if (!token) return;

    fetch("https://movie-api-x3ci.onrender.com/movies", {
      headers: {Authorization: `Bearer ${token}`}
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        const moviesFromApi = data.map((movie) => {
          return {
            id: movie._id,
            title: movie.Title,
            description: movie.Description,
            image: `${movie.ImagePath}`,
            director: movie.Director.Name,
          };
        });

        setMovies(moviesFromApi);
      });
  }, [token]);
  
    return (
      <Row>
        {!user ? (
          <Col md={5}>
            <LoginView onLoggedIn={(user) => setUser(user)} />
            or
            <SignupView />
          </Col>
        ) : selectedMovie ? (
          <Col md={8}>
            <MovieView
            movie={selectedMovie}
            onBackClick={() => setSelectedMovie(null)}
            />
          </Col>
        ) : (
          <>
          {movies.map((movie) => (
            <Col className="mb-5" key={movie.id} md={3}>
              <MovieCard
              key={movie.id}
              movie={movie}
              onMovieClick={(newSelectedMovie) => {
                setSelectedMovie(newSelectedMovie);
              }}
              />
            </Col>
          ))}
          </>
        )}
        <button onClick={() => { setUser(null); setToken(null); localStorage.clear(); }}>Logout</button>
      </Row>
  );
  };