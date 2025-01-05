//USERID LOGGED AS UNDEFINED

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {UserInfo} from "./user-info";
import {DeregisterButton} from "./deregister-button";
import {FavoriteMovies} from "./favorite-movies";
import {UpdateUser} from "./update-user";
import { Card, Container, Row, Col } from "react-bootstrap";

export const ProfileView = ({ users = [],  favoriteMovies, handleFavoriteToggle, setFavoriteMovies}) => {
  const { userId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const storedToken = localStorage.getItem("token");
  const [token, setToken] = useState(storedToken);
  const [movies, setMovies] = useState([]);

  // Find user by ID
  console.log("Users: ", users);
  console.log("userId", userId);
  const user = users.find((u) => u.userId === userId);
  console.log("User1: ", user);

  useEffect(() => {
    if (user) {
      setFavoriteMovies(user.favoriteMovies);
    }
  }, [user]);

  useEffect(() => {
    if (!token) return;
    fetch("https://movie-api-x3ci.onrender.com/movies", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const moviesFromApi = data.map((movie) => ({
          id: movie._id,
          title: movie.title,
          image: movie.imageurl,
          directors: movie.directors?.[0]?.name || "Director not found",
          genre: movie.genre?.name || "Genre not found",
          description: movie.description
        }));
        setMovies(moviesFromApi);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }, [token]);

  const favoriteMovieList = movies.filter(
    (m) => favoriteMovies.includes(String(m.id)) // Converts m.id to string
  );

  // Initialize editedUser with user data when switching to edit mode
  const handleEditClick = () => {
    setIsEditing(true);
    setEditedUser({ ...user });
  };

  // Handle input changes
  const handleChange = (e) => {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value
    });
  };

  // Handle save action
  const handleSaveClick = async () => {
    try {
      const response = await fetch(
        `https://movie-api-x3ci.onrender.com/user/${user.username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editedUser),
        }
      );

      // Update the user data in local state after successful response
      Object.assign(user, editedUser);

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const onLoggedOut = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    window.location.reload();
  };

  if (!user) {
    console.log("User: ", user)
    return <div>User not found</div>;
  }

  return (
    <>
      <Container>
        <Row>
          <Col xs={12} sm={4}>
          <Card>
            <Card.Body>
            <UserInfo name={user.Username} email={user.email} birthday={user.birthday}/>
            </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={8}>
          <Card>
          <Card.Body>
            <UpdateUser
              user={user}
              handleChange={handleChange}
              handleSaveClick={handleSaveClick}
              handleEditClick={handleEditClick}
              isEditing={isEditing}
              editedUser={editedUser}
            />
            </Card.Body>
            </Card>
            
            <hr/>
            <h3>Delete Account</h3>
            <DeregisterButton
          username={user.Username}
          token={token}
          onLoggedOut={onLoggedOut}
        />
          </Col>
        </Row>
        
        <hr />
        <FavoriteMovies
          user={user}
          favoriteMovies={favoriteMovies}
          handleFavoriteToggle={handleFavoriteToggle}
          favoriteMovieList={favoriteMovieList}
        />
      </Container>
    </>
  );
};