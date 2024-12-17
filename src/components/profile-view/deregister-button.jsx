import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const DeregisterButton = ({ username, token, onLoggedOut }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("token");

  const handleDeregisterClick = async () => {
    try {
      const response = await fetch(
        `https://movie-api-x3ci.onrender.com/users/${username}`, 
        {
          method: "DELETE",
          headers: {
            Authorization : `Bearer ${token}`
          }
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP Error. Status ${response.status}`);
      }
      onLoggedOut();
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)} variant="danger">
        Delete Account
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete your account?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            No
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleDeregisterClick();
              setShowModal(false);
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};