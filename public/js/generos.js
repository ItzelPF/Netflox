document.addEventListener("DOMContentLoaded", function () {
    const moviesCont = document.getElementById("movies-cont");
    const searchQuery = document.getElementById("search-query");

    const genreButtons = document.querySelectorAll(".genre-btn");
    const avatar = document.getElementById("avatar");
    const dropdown = document.getElementById("dropdown");
    const logout = document.getElementById("logout");
    const deleteProfile = document.getElementById("deleteProfile");
    const modifyProfile = document.getElementById("modifyProfile");

    // Evento para modificar el perfil
    modifyProfile.addEventListener("click", () => {
        const path = window.location.pathname.split('/');
        const userId = path[2];
        const profileId = path[3];
        window.location.href = `/modificarPerfil/${userId}/${profileId}`;
    });

    // Evento para eliminar el perfil
    deleteProfile.addEventListener("click", async () => {
        if (confirm("¿Estás seguro de que deseas eliminar tu perfil?")) {
            const path = window.location.pathname.split('/');
            const userId = path[2];
            const profileId = path[3];
            try {
                const response = await fetch(`/deleteProfile/${userId}/${profileId}`, { method: "DELETE" });
                if (response.ok) {
                    alert("Perfil eliminado correctamente");
                    window.location.href = "/index";
                } else {
                    alert("Error al eliminar el perfil.");
                }
            } catch (error) {
                console.error("Error al eliminar el perfil:", error);
            }
        }
    });

    // Evento para cerrar sesión
    logout.addEventListener("click", () => {
        window.location.href = "/index";
    });

    // Evento para mostrar/ocultar el menú del avatar
    avatar.addEventListener("click", () => {
        dropdown.classList.toggle("hidden");
    });

    // Ocultar el menú si se hace clic fuera del dropdown
    document.addEventListener("click", (event) => {
        if (!avatar.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.add("hidden");
        }
    });

    // Función para obtener las películas por género
    async function fetchMoviesByGenre(genre) {
        try {
            const response = await fetch(`/api/movies/genre?q=${encodeURIComponent(genre)}`);
            const movies = await response.json();
            moviesCont.innerHTML = "";
            if (movies.length === 0) {
                moviesCont.innerHTML = "<p>No hay películas disponibles para este género.</p>";
                return;
            }
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
        movieThumbnail.src = movie.thumbnail || "/img/default-thumbnail.jpg";

        const movieTitle = document.createElement("h3");
        movieTitle.textContent = movie.title;

        const movieDescription = document.createElement("p");
        movieDescription.textContent = movie.description;

        const movieLink = document.createElement("a");
        movieLink.href = "#";
        movieLink.textContent = "Ver ahora";

        movieDiv.appendChild(movieThumbnail);
        movieDiv.appendChild(movieTitle);
        movieDiv.appendChild(movieDescription);
        movieDiv.appendChild(movieLink);

        return movieDiv;
    }

    // Manejar el filtro por género
    genreButtons.forEach(button => {
        button.addEventListener("click", function () {
            const genre = button.getAttribute("data-genre");
            fetchMoviesByGenre(genre);
        });
    });

    // Manejar la búsqueda en tiempo real
    searchQuery.addEventListener("input", function () {
        const query = searchQuery.value.toLowerCase().trim();
        const movies = moviesCont.querySelectorAll(".movie");
        movies.forEach(movie => {
            const title = movie.querySelector("h3").textContent.toLowerCase();
            const description = movie.querySelector("p").textContent.toLowerCase();
            movie.style.display = (title.includes(query) || description.includes(query)) ? "" : "none";
        });
    });
});
