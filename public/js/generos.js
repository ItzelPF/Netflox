
document.addEventListener("DOMContentLoaded", function () {
    const moviesCont = document.getElementById("movies-cont");
    const genreButtons = document.querySelectorAll(".genre-btn");
    const avatar = document.getElementById("avatar");
    const dropdown = document.getElementById("dropdown");
    const logout = document.getElementById("logout"); // Asegúrate de obtener el botón de logout

    // Evento para cerrar sesión
    logout.addEventListener("click", () => {
        window.location.href = "/index"; // Redirige a la página de inicio
    });

    // Evento para mostrar/ocultar el menú del avatar
    avatar.addEventListener("click", () => {
        dropdown.classList.toggle("hidden"); // Alterna la visibilidad del dropdown
    });

    // Ocultar el menú si se hace clic fuera del dropdown
    document.addEventListener("click", (event) => {
        if (!avatar.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.add("hidden"); // Añadir la clase 'hidden' si se hace clic fuera
        }
    });


    // Función para obtener las películas por género
    async function fetchMoviesByGenre(genre) {
        try {
            const response = await fetch(`/api/movies/genre?q=${encodeURIComponent(genre)}`);
            const movies = await response.json();

            // Limpiar el contenedor de películas
            moviesCont.innerHTML = "";

            // Si no hay películas para ese género
            if (movies.length === 0) {
                moviesCont.innerHTML = "<p>No hay películas disponibles para este género.</p>";
                return;
            }

            // Mostrar las películas filtradas
            movies.forEach(movie => {
                const movieElement = createMovieCard(movie);
                moviesCont.appendChild(movieElement);
            });
        } catch (error) {
            console.error("Error al cargar las películas por género:", error);
            moviesCont.innerHTML = "<p>No se pudieron cargar las películas. Intenta más tarde.</p>";
        }
    }

    // Crear la tarjeta de cada película
    function createMovieCard(movie) {
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

        return movieDiv;
    }

    // Evento para manejar el filtro por género
    genreButtons.forEach(button => {
        button.addEventListener("click", function () {
            const genre = button.getAttribute("data-genre");
            fetchMoviesByGenre(genre);
        });
    });


});