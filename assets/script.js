const API_KEY = '2a3c21f7203959050cb73bdefd2b2ae2'; //chave api
const API_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const ageInput = document.getElementById('age');
const genreSelect = document.getElementById('genre');
const searchBtn = document.getElementById('searchBtn');
const results = document.getElementById('results');
const header = document.querySelector('header');

let currentPage = 1;
let currentGenre = '';
let currentAge = null;

async function fetchGenres() {
  const res = await fetch(`${API_BASE}/genre/movie/list?api_key=${API_KEY}&language=pt-BR`);
  const data = await res.json();
  data.genres.forEach(genre => {
    const option = document.createElement('option');
    option.value = genre.id;
    option.textContent = genre.name;
    genreSelect.appendChild(option);
  });
}

function shuffleArray(arr) {
  for(let i = arr.length -1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i +1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function fetchMovies(initial = false) {
  if (initial) {
    currentPage = Math.floor(Math.random() * 20) + 1;
    currentGenre = '';
    currentAge = null;
    ageInput.value = '';
    genreSelect.value = '';
  } else {
    currentPage++;
    currentAge = parseInt(ageInput.value);
    currentGenre = genreSelect.value;
    if(currentPage > 20) currentPage = 1
  }

  let url = `${API_BASE}/discover/movie?api_key=${API_KEY}&language=pt-BR&sort_by=popularity.desc&page=${currentPage}`;
  if (currentGenre) url += `&with_genres=${currentGenre}`;

  const res = await fetch(url);
  const data = await res.json();
  const shuffledMovies = shuffleArray(data.results);

  results.innerHTML = '';

  shuffledMovies.forEach(movie => {
    if (!movie.poster_path || !movie.title) return;
    const card = document.createElement('div');
    card.classList.add('movie-card');
    card.innerHTML = `
      <img src="${IMG_BASE}${movie.poster_path}" alt="${movie.title}" />
      <h3>${movie.title}</h3>
    `;
    card.onclick = () => openMovieDetails(movie.id);
    results.appendChild(card);
  });
}

function openMovieDetails(movieId) {
  window.location.href = `infos.html?movie=${movieId}`;
}

const originalBodyHTML = document.body.innerHTML;

function bindEvents() {
  searchBtn.addEventListener('click', () => fetchMovies(false));
}

bindEvents();
fetchGenres();
fetchMovies(true);
