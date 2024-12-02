import React, { useState, useEffect } from 'react';
import './Question.css';
import { getRandomPokemon } from '../utils/api'; // Assuming the API call is available

const getRandomIncorrectOption = async (correctAnswer) => {
  let randomOption;
  do {
    const randomId = Math.floor(Math.random() * 151) + 1; // Random ID between 1 and 151
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await response.json();
    randomOption = data.name;
  } while (randomOption === correctAnswer);
  return randomOption;
};

const Question = ({ pokemon, handleAnswer }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5); // Start each question with 5 seconds

  // Fetch options for the current question
  const fetchRandomOptions = async () => {
    const incorrectOptionsPromises = [];
    while (incorrectOptionsPromises.length < 3) {
      const promise = getRandomIncorrectOption(pokemon.name);
      incorrectOptionsPromises.push(promise);
    }

    const incorrectOptions = await Promise.all(incorrectOptionsPromises);
    const allOptions = [pokemon.name, ...incorrectOptions].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    setLoading(false);
  };

  useEffect(() => {
    fetchRandomOptions();
    const imageTimer = setTimeout(() => {
      setImageLoaded(true);
    }, 0); // Show image after 3 seconds

    return () => clearTimeout(imageTimer);
  }, [pokemon]);

  // Timer logic for each question
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer); // Clear timer when time is up
          handleAnswer(false); // Automatically move to next question
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount or new question
  }, [handleAnswer]);

  // Reset timer whenever a new question is loaded
  useEffect(() => {
    setTimeLeft(5); // Reset to 5 seconds on new question
  }, [pokemon]);

  const handleOptionClick = (option) => {
    handleAnswer(option === pokemon.name);
  };

  return (
    <div className="quiz-container">
      <h2>Which Pokémon is this?</h2>

      {loading ? <p>Loading options...</p> : null}

      {imageLoaded && <img src={pokemon.sprites.front_default} alt="Pokemon" />}

      <p class="timer">Time left: {timeLeft} seconds</p>

      {options.length > 0 && !loading && imageLoaded && (
        options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </button>
        ))
      )}
    </div>
  );
};



export default Question;
