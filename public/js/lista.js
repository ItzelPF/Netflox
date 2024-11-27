document.addEventListener("DOMContentLoaded", () => {
    const moviesContainer = document.getElementById("movies-cont");

    // Fetch movies from the server (example, replace with your API endpoint)
    fetch("/peliculas")
        .then(response => response.json())
        .then(movies => {
            movies.forEach(movie => {
                const movieCard = createMovieCard(movie);
                moviesContainer.appendChild(movieCard);
            });
        })
        .catch(error => console.error("Error fetching movies:", error));
});

// Helper function to create a movie card
function createMovieCard(movie) {
    const card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
        <img src="${movie.thumbnail}" alt="${movie.title}" class="movie-thumbnail">
        <div class="movie-info">
            <h3>${movie.title}</h3>
            <p>${movie.description}</p>
            <span class="movie-rating">⭐ ${movie.rating}/10</span>
        </div>
    `;

    return card;
}
