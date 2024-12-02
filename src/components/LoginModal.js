import React, { useState } from 'react';
import axios from 'axios';
import './LoginModal.css';

const LoginModal = ({ closeModal, setUser }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const { data } = await axios.get(
          `http://localhost:5000/users?username=${formData.username}`
        );

        if (data.length) {
          alert('Username already exists. Please choose a different username.');
        } else {
          // Register new user with highscore set to 0 by default
          await axios.post('http://localhost:5000/users', {
            ...formData,
            highscore: 0,
          });
          alert('Registration successful!');
          setIsRegister(false);
        }
      } else {
        const { data } = await axios.get(
          `http://localhost:5000/users?username=${formData.username}&password=${formData.password}`
        );

        if (data.length) {
          alert('Login successful!');
          setUser({
            id: data[0].id,
            username: data[0].username,
            highscore: data[0].highscore, // Include highscore in user state
          });
          closeModal();
        } else {
          alert('Invalid credentials!');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };
  

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{isRegister ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
        </form>
        <button onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Switch to Login' : 'Switch to Register'}
        </button>
        <button className="close-button" onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
