import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import Question from './components/Question';
import { getRandomPokemon } from './utils/api';
import HomePage from './components/HomePage';

const QuizPage = ({ user, setUser }) => {  // Receive user and setUser as props
  const [pokemon, setPokemon] = useState(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const navigate = useNavigate();

  const fetchPokemon = async () => {
    const randomPokemon = await getRandomPokemon();
    setPokemon(randomPokemon);
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
    setQuestionCount((prevCount) => prevCount + 1);

    setTimeout(() => {
      if (questionCount < 9) {
        fetchPokemon();
      }
    }, 500);
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  if (questionCount >= 10) {
    // Check if score is greater than current highscore
    if (user && score > user.highscore) {
      // Update the highscore by setting a new user state
      const updatedUser = { ...user, highscore: score };
      setUser(updatedUser);  // Update the user state to reflect the new highscore

      // Optionally, you can update the backend (e.g., with axios)
      axios.patch(`http://localhost:5000/users/${user.id}`, { highscore: score })
        .then(() => {
          alert('Highscore updated!');
        })
        .catch(error => {
          console.error('Error updating highscore:', error);
          alert('Failed to update highscore.');
        });
    }

    return (
      <div className="quiz-container">
        <h2>Quiz Over!</h2>
        <p>Your final score: {score} out of 10</p>
        <button onClick={() => navigate('/')}>Home</button>
      </div>
    );
  }

  return (
    <div>
      {pokemon ? (
        <Question pokemon={pokemon} handleAnswer={handleAnswer} />
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null); // State for user authentication

  return (
    <Router>
      <Routes>
        {/* Pass user and setUser to HomePage for login and username display */}
        <Route path="/" element={<HomePage user={user} setUser={setUser} />} />
        {/* Pass user and setUser to QuizPage */}
        <Route path="/quiz" element={<QuizPage user={user} setUser={setUser} />} />
      </Routes>
    </Router>
  );
};

export default App;
