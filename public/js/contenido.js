document.addEventListener("DOMContentLoaded", function () {
    const moviesCont = document.getElementById("movies-cont");
    const searchQuery = document.getElementById("search-query");

    // Función para obtener todas las películas desde el servidor
    async function fetchAllMovies() {
        try {
            const response = await fetch("/api/movies"); // Obtener todas las películas
            const movies = await response.json();

            // Limpiar el contenedor de películas
            moviesCont.innerHTML = "";

            // Si no hay películas
            if (movies.length === 0) {
                moviesCont.innerHTML = "<p>No hay películas disponibles.</p>";
                return;
            }

            // Mostrar todas las películas
            movies.forEach(movie => {
                const movieElement = createMovieCard(movie);
                moviesCont.appendChild(movieElement);
            });
        } catch (error) {
            console.error("Error al cargar las películas:", error);
            moviesCont.innerHTML = "<p>No se pudieron cargar las películas. Intenta más tarde.</p>";
        }
    }

    // Función para obtener las películas filtradas por búsqueda
    async function fetchMovies(query) {
        try {
            const response = await fetch(`/api/movies?q=${encodeURIComponent(query)}`); // Búsqueda con parámetro q
            const movies = await response.json();

            // Limpiar el contenedor de películas
            moviesCont.innerHTML = "";

            // Mostrar las películas filtradas
            movies.forEach(movie => {
                const movieElement = createMovieCard(movie);
                moviesCont.appendChild(movieElement);
            });
        } catch (error) {
            console.error("Error al buscar las películas:", error);
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

    // Evento para manejar la búsqueda
    searchQuery.addEventListener("input", function () {
        const query = searchQuery.value.trim();

        if (query) {
            // Si hay búsqueda, mostramos las películas filtradas
            fetchMovies(query);
        } else {
            // Si no hay búsqueda, mostramos todas las películas
            fetchAllMovies();
        }
    });

    // Cargar todas las películas al inicio cuando la página se carga
    fetchAllMovies();
});

document.addEventListener("DOMContentLoaded", () => {
    const avatar = document.getElementById("avatar");
    const dropdown = document.getElementById("dropdown");

    avatar.addEventListener("click", () => {
        // Alterna la clase 'hidden' en el dropdown
        dropdown.classList.toggle("hidden");
    });

    // Redirigir a /index cuando se selecciona "Cerrar sesión"
    logout.addEventListener("click", () => {
        window.location.href = "/index"; // Redirige a la página de inicio
    });

    // Opcional: Ocultar el menú si se hace clic fuera de él
    document.addEventListener("click", (event) => {
        if (!avatar.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.add("hidden");
        }
    });
});