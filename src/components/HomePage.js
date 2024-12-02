import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';
import axios from 'axios'; // Import axios for API requests
import './HomePage.css';

const HomePage = ({ user, setUser }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showUserOptions, setShowUserOptions] = useState(false); // State to control the options popup

  // Toggle the login modal
  const toggleLoginModal = () => {
    setShowLogin(!showLogin);
  };

  // Toggle user options popup
  const toggleUserOptions = () => {
    setShowUserOptions(!showUserOptions);
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null); // Clear the user state
    setShowUserOptions(false); // Close the user options modal
  };

  const handleDelete = async () => {
    try {
      if (!user || !user.id) {
        console.error("User is not logged in or missing id");
        alert("Unable to delete account: User is not logged in.");
        return;
      }

      const userId = user.id; // Use the user's ID for deletion
      console.log("Attempting to delete user with ID:", userId);

      // Make the DELETE request using the user's ID
      const response = await axios.delete(`http://localhost:5000/users/${userId}`);

      if (response.status === 200) {
        console.log("Account deleted successfully:", response);
        alert('Account deleted!');
        setUser(null); // Clear the user state
        setShowUserOptions(false); // Close the user options modal
      } else {
        console.error("Failed to delete account, status:", response.status);
        alert("There was an issue deleting your account.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert('There was an issue deleting your account.');
    }
  };

  // Show login modal if user is not logged in
  const handleReadyClick = () => {
    if (!user) {
      setShowLogin(true); // Open the login modal if user is not logged in
    }
  };

  return (
    <div className="home-page-wrapper">
      <nav>
        {user ? (
          <button className="user-greeting" onClick={toggleUserOptions}>
            Trainer {user.username}!
          </button>
        ) : (
          <a href="#" onClick={toggleLoginModal}>
            Login
          </a>
        )}
      </nav>

      {/* User options popup */}
      {showUserOptions && (
        <div className="user-options-popup">
          <button onClick={handleLogout}>Logout</button>
          <button onClick={handleDelete}>Delete Account</button>
          <button onClick={() => setShowUserOptions(false)}>Close</button>
          <p class="hs">Highscore : {user ? user.highscore : 'Loading...'}</p>
        </div>
      )}

      <div className="banner-area">
        <h2>Pokémon Quiz!</h2>

        {/* Button remains clickable, and login modal is shown when clicked */}
        <button
          className="start-button"
          onClick={handleReadyClick} // Opens the login modal if user is not logged in
        >
          {user ? (
            <Link to="/quiz">
              Start
            </Link>
          ) : (
            "Ready?"
          )}
        </button>
      </div>

      {/* Show the login modal if needed */}
      {showLogin && <LoginModal closeModal={toggleLoginModal} setUser={setUser} />}
    </div>
  );
};

export default HomePage;
