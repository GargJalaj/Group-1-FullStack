import axios from 'axios';

const API_URL = 'https://pokeapi.co/api/v2';

export const getRandomPokemon = async () => {
  const randomId = Math.floor(Math.random() * 151) + 1; // Total 898 Pokémon
  const response = await axios.get(`${API_URL}/pokemon/${randomId}`);
  return response.data;
};
