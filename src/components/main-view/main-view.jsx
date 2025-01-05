//just installed axios, run parcel first

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
import { FavoriteMovies } from '../profile-view/favorite-movies';

import axios from "axios";

export const MainView = () => {
  console.log(localStorage.getItem("user"));
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");
  const [movies, setMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(storedToken);
  const [users, setUsers] = useState([])

  const handleFavoriteToggle = async (movieId, isFavorite) => {
    const storedToken = localStorage.getItem("token");
    const username = user.username; // Adjust this if user identification is different

    try {
      const authHeader = {
        Authorization: `Bearer ${storedToken}`,
      };

      if (isFavorite) {
        await axios.post(
          `https://movie-api-4o5a.onrender.com/user/${username}/movies/${movieId}`,
          {},
          { authHeader }
        );
        const user = JSON.parse(localStorage.getItem('user'));
        user.favorite_movies.push(movieId);
        localStorage.setItem('user', JSON.stringify(user));
        setFavoriteMovies([...user.favorite_movies]);

        
      } else {
        await axios.delete(
          `https://movie-api-4o5a.onrender.com/user/${username}/movies/${movieId}`,
          { authHeader }
        );
        const user = JSON.parse(localStorage.getItem('user'));
        const favorites = user.favorite_movies.filter((id) => id !== movieId);
        user.favorite_movies = [...favorites];
        localStorage.setItem('user', JSON.stringify(user));
        setFavoriteMovies([...favorites]);
       
      }

      // Re-fetch or update local state to reflect changes
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
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

      fetch("https://movie-api-x3ci.onrender.com/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Users Data: ", data)
        const usersFromApi = data.map((user) => ({
          userId: user._id,
          username: user.Username,
          password: user.Password,
          email: user.Email,
          birthday: user.Birthday,
          favoriteMovies: user.Favorites || [],
        }));
        setUsers(usersFromApi);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
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
                    users={users}
                    favoriteMovies={favoriteMovies}
                    handleFavoriteToggle={handleFavoriteToggle}
                    setFavoriteMovies={setFavoriteMovies}
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
                        onFavoriteToggle={(handleFavoriteToggle)}
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