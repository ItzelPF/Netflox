
document.addEventListener("DOMContentLoaded", function () {
    const moviesCont = document.getElementById("movies-cont");
    const searchQuery = document.getElementById("search-query");

    const genreButtons = document.querySelectorAll(".genre-btn");
    const avatar = document.getElementById("avatar");
    const dropdown = document.getElementById("dropdown");
    const logout = document.getElementById("logout"); // Asegúrate de obtener el botón de logout
    const deleteProfile = document.getElementById("deleteProfile");
    const modifyProfile = document.getElementById("modifyProfile");

    // Evento para modificar el perfil
    modifyProfile.addEventListener("click", async () => {
        if (modifyProfile) {
            // Simula una confirmación para seguir adelante
            const userConfirmed = confirm("¿Deseas modificar este perfil?");
            
            if (userConfirmed) {
                try {
                    // Obtén el ID del usuario y el ID del perfil de la URL
                    const path = window.location.pathname.split('/');
                    const userId = path[2]; // El ID del usuario es el tercer segmento
                    const profileId = path[3]; // El ID del perfil es el cuarto segmento

                    // Redirige a la página de modificación del perfil
                    window.location.href = `/modificarPerfil/${userId}/${profileId}`;
                } catch (error) {
                    console.error("Error al redirigir a la página de modificación:", error);
                    alert("Hubo un problema al intentar redirigir a la página de modificación.");
                }
            }
        } else {
            console.error("No se encontró el botón 'modifyProfile' en el DOM.");
        }
    });
    
    // Evento para eliminar el perfil
    deleteProfile.addEventListener("click", async () => {
        const userConfirmed = confirm("¿Estás seguro de que deseas eliminar tu perfil?");
        if (userConfirmed) {
            try {
                // Obtén el ID del usuario y el ID del perfil de la URL
                const path = window.location.pathname.split('/');
                const userId = path[2]; // El ID del usuario es el tercer segmento
                const profileId = path[3]; // El ID del perfil es el cuarto segmento

                // Construye la URL dinámica en función del recurso
                const url = `/deleteProfile/${userId}/${profileId}`;

                // Realiza la solicitud DELETE
                const response = await fetch(url, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    alert("Perfil eliminado correctamente");
                    window.location.href = "/index"; // Redirige después de eliminar el perfil
                } else {
                    const errorData = await response.json();
                    alert(`Hubo un error: ${errorData.message}`);
                }
            } catch (error) {
                console.error("Error en la eliminación del perfil:", error);
                alert("Hubo un problema al intentar eliminar el perfil.");
            }
        }
    });

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
  // Manejar la búsqueda en tiempo real
  searchQuery.addEventListener("input", function () {
    const query = searchQuery.value.toLowerCase().trim();
    const movies = moviesCont.querySelectorAll(".movie");

    movies.forEach(movie => {
        const title = movie.querySelector("h3").textContent.toLowerCase();
        const description = movie.querySelector("p").textContent.toLowerCase();

        // Mostrar u ocultar la película según coincida con el título o descripción
        if (title.includes(query) || description.includes(query)) {
            movie.style.display = ""; // Mostrar
        } else {
            movie.style.display = "none"; // Ocultar
        }
    });
});

});