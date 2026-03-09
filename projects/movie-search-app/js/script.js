const apiKey = "f4747bc7";
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const movieResults = document.getElementById("movieResults");
const movieModal = document.getElementById("movieModal");
const modalDetails = document.getElementById("modalDetails");
const closeModal = document.getElementById("closeModal");
const favoriteBtn = document.getElementById("favoriteBtn");//add


window.addEventListener("load", function () {
    searchInput.focus();
});

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (!query) return alert("Please enter a movie name.");
    fetchMovies(query);
});

searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchBtn.click();
    }
});

async function fetchMovies(query) {
    movieResults.innerHTML = "Loading...";
    try {
        const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
        const data = await res.json();
        if (data.Response === "True") {
            displayMovies(data.Search);
        } else {
            movieResults.innerHTML = `<p>${data.Error}</p>`;
        }
    } catch (error) {
        movieResults.innerHTML = `<p>Error fetching movies.</p>`;
        console.error(error);
    }
}

function displayMovies(movies) {

    movieResults.innerHTML = "";

    movies.forEach(movie => {

        const card = document.createElement("div");
        card.classList.add("movie-card");

        card.innerHTML = `
      <img src="${movie.Poster}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
    `;

        card.addEventListener("click", () => {
            fetchMovieDetails(movie.imdbID);
        });

        movieResults.appendChild(card);

    });
}

//Helper functions for favorites
function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

//Fetch full movie details
async function fetchMovieDetails(id) {
    const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`);
    const movie = await response.json();
    const favorites = getFavorites();//add
    const isFavorite = favorites.some(fav => fav.imdbID === movie.imdbID);//add

    favoriteBtn.textContent = isFavorite ? "Remove from Favorites" : "Add to Favorites";//add

    // Add click listener
    favoriteBtn.onclick = () => {
        let favorites = getFavorites();

        if (favorites.some(fav => fav.imdbID === movie.imdbID)) {
            // Remove from favorites
            favorites = favorites.filter(fav => fav.imdbID !== movie.imdbID);
            favoriteBtn.textContent = "Add to Favorites";
        } else {
            // Add to favorites
            favorites.push({
                imdbID: movie.imdbID,
                Title: movie.Title,
                Poster: movie.Poster,
                Year: movie.Year
            });
            favoriteBtn.textContent = "Remove from Favorites";
        }

        saveFavorites(favorites);
    };

    document.getElementById("modalPoster").src = movie.Poster !== "N/A" ? movie.Poster : "images/placeholder.png";
    document.getElementById("modalTitle").textContent = movie.Title;
    document.getElementById("modalYear").textContent = movie.Year;
    document.getElementById("modalGenre").textContent = movie.Genre;
    document.getElementById("modalActors").textContent = movie.Actors;
    document.getElementById("modalPlot").textContent = movie.Plot;
    document.getElementById("modalRating").textContent = movie.imdbRating;

    movieModal.classList.remove("hidden");
}

//Closes Modal
closeModal.addEventListener("click", () => {
    movieModal.classList.add("hidden");
});

//Closed modal when clicking outside of the content
movieModal.addEventListener("click", (e) => {
  if (e.target === movieModal) {
    movieModal.classList.add("hidden");
  }
});
