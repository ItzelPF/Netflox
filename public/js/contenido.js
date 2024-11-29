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


document.addEventListener("DOMContentLoaded", async () => {
    const moviesCont = document.getElementById("movies-cont");

    try {
        // Obtener las películas desde la API
        const response = await fetch("/api/movies");
        const movies = await response.json();

        // Verificar si hay películas
        if (movies.length === 0) {
            moviesCont.innerHTML = "<p>No hay películas disponibles.</p>";
            return;
        }

        // Crear el HTML para cada película
        movies.forEach((movie) => {
            const movieDiv = document.createElement("div");
            movieDiv.classList.add("movie");

            const movieThumbnail = document.createElement("img");
            movieThumbnail.src = movie.thumbnail || "/img/default-thumbnail.jpg"; // Usar una miniatura por defecto si no hay

            const movieTitle = document.createElement("h3");
            movieTitle.textContent = movie.title;

            const movieDescription = document.createElement("p");
            movieDescription.textContent = movie.description;

            const movieLink = document.createElement("a");
            movieLink.href = movie.url;
            movieLink.textContent = "Ver ahora";

            // Añadir los elementos al contenedor de la película
            movieDiv.appendChild(movieThumbnail);
            movieDiv.appendChild(movieTitle);
            movieDiv.appendChild(movieDescription);
            movieDiv.appendChild(movieLink);

            // Añadir la película al contenedor principal
            moviesCont.appendChild(movieDiv);
        });
    } catch (error) {
        console.error("Error al cargar las películas:", error);
        moviesCont.innerHTML = "<p>Error al cargar las películas.</p>";
    }
});