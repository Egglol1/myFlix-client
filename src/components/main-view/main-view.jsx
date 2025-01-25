import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";
import {Col, Row, Form, InputGroup} from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

export const MainView = () => {
  console.log(localStorage.getItem("user"));
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [movies, setMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(storedToken);
  const [filter, setFilter] = useState("");

  const handleAddFavorite = (movieId) => {
    fetch(`https://movie-api-x3ci.onrender.com/user/${user.Username}/movies/${movieId}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` },
    })
    .then((response) => response.json())
    .then((data) => {
      setFavoriteMovies(data.FavoriteMovies || []);
    })
    .catch((error) => console.error("Error adding to favorites", error));
  };

  const handleRemoveFavorite = (movieId) => {
    fetch(`https://movie-api-x3ci.onrender.com/user/${user.Username}/movies/${movieId}`, {
      method: "DELETE",
      headers: {Authorization: `Bearer ${token}` },
    })
    .then((response) => response.json())
    .then((data) => {
      setFavoriteMovies(data.FavoriteMovies);
    })
    .catch((error) => console.error("Error removing from favorites", error));
  };
  
  useEffect(() => {
    if (!token) return;

    fetch("https://movie-api-x3ci.onrender.com/movies", {
      headers: {Authorization: `Bearer ${token}`}
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data: ", data)
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

  const getSimilarMovies = (movieId) => {
    const currentMovie = movies.find((movie) => movie.id === movieId);
    if (!currentMovie) return [];
    return movies.filter(
      (movie) =>
        movie.genre.name === currentMovie.genre.name && movie.id !== movieId
    );
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
  
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(filter.toLowerCase())
  );

    return (
      <BrowserRouter>
        <NavigationBar
          user={user}
          onLoggedOut={() => {
            setUser(null);
          }}
        />
        <Row>
          <Routes>
            <Route
              path="/signup"
              element={
                <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <SignupView/>
                  </Col>
                )}
                </>
              }
            />
            <Route
            path="/login"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <LoginView onLoggedIn={(user, token) => {
                      setUser(user);
                      setToken(token);
                      }} />
                  </Col>
                )}
              </>

            }
            />
            <Route
              path="/"
              element={
                <>
                  <Form className="filter-form mb-4">
                    <Form.Group controlId="filter">
                      <Form.Label className="form-label-dark"></Form.Label>
                      <InputGroup>
                      <InputGroup.Text>
                      <i className="bi bi-search"></i>{" "}
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Start typing to filter..."
                        value={filter}
                        onChange={handleFilterChange}
                        className="form-control-dark"
                      />
                      </InputGroup>
                    </Form.Group>
                  </Form>
                  <Row>
                    {filteredMovies.map((movie) => (
                      <Col
                        classNmae="mb-5"
                        key={movie.id}
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                      >
                        <MovieCard movie={movie}/>
                      </Col>
                    ))}
                  </Row>
                </>
              }
            />
          <Route
            path="movies/:movieId"
            element={
              <>
              {!user ? (
                <Navigate to="/login" replace />
              ) : movies.length === 0? (
                <Col>The list is Empty!</Col>
              ) : (
                <Col md={8}>
                  <MovieView 
                  movie={movies}
                  getSimilarMovies={getSimilarMovies}
                  user={user}
                  setUser={setUser}
                  token={token}
                  />
                </Col>
              )}
              </>
            }
          />
          <Route
            path="/user/:Username"
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : (
                <Col>
                  <ProfileView
                    user={user}
                    token={token}
                    favoriteMovies={favoriteMovies}
                    setFavoriteMovies={setFavoriteMovies}
                    movies={movies}
                    setUser={(updatedUser) => dispatchEvent(setUser(updatedUser))}
                  />
                </Col>
              )
            }
          />
          <Route
            path="/"
            element={
              <>
              {!user ? (
                <Navigate to="/login" replace />
              ) : movies.length === 0 ? (
                <Col>The list is empty!</Col>
              ) : (
                <>
                  {movies.map((movie) => (
                    <Col className="mb-4" key={movie.id} md={3}>
                      <MovieCard 
                        movie={movie}
                        handleAddFavorite={handleAddFavorite}
                        handleRemoveFavorite={handleRemoveFavorite}
                        isFavorite={favoriteMovies.includes(String(movie._id))}
                       />
                    </Col>
                  ))}
                </>
              )}
              </>
            }
          />
          </Routes>
        </Row>
      </BrowserRouter>
  );
  };