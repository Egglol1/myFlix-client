import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

export const MainView = () => {
  console.log(localStorage.getItem("user"));
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [movies, setMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(storedToken);

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
            path="movies/:movieId"
            element={
              <>
              {!user ? (
                <Navigate to="/login" replace />
              ) : movies.length === 0? (
                <Col>The list is Empty!</Col>
              ) : (
                <Col md={8}>
                  <MovieView movie={movies} />
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
                    favoriteMovies={favoriteMovies}
                    setFavoriteMovies={setFavoriteMovies}
                    movies={movies}
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