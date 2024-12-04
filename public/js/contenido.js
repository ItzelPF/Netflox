document.addEventListener("DOMContentLoaded", function () {
    const moviesCont = document.getElementById("movies-cont");
    const searchQuery = document.getElementById("search-query");
    const avatar = document.getElementById("avatar");
    const dropdown = document.getElementById("dropdown");
    const logout = document.getElementById("logout"); // Asegúrate de obtener el botón de logout
    const deleteProfile = document.getElementById("deleteProfile");
    const modifyProfile = document.getElementById("modifyProfile");

    // Evento para cerrar sesión
    logout.addEventListener("click", () => {
        window.location.href = "/index"; // Redirige a la página de inicio
    });

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
                    console.log("Perfil eliminado con éxito.");
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

    // Función para obtener todas las películas desde el servidor
    async function fetchAllMovies() {
        try {
            const response = await fetch("/api/movies");
            const movies = await response.json();
            moviesCont.innerHTML = "";

            if (movies.length === 0) {
                moviesCont.innerHTML = "<p>No hay películas disponibles.</p>";
                return;
            }

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
            const response = await fetch(`/api/movies?q=${encodeURIComponent(query)}`);
            const movies = await response.json();
            moviesCont.innerHTML = "";

            if (movies.length === 0) {
                moviesCont.innerHTML = "<p>No se encontraron películas.</p>";
                return;
            }

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
        movieThumbnail.src = movie.thumbnail || "/img/default-thumbnail.jpg";

        const movieTitle = document.createElement("h3");
        movieTitle.textContent = movie.title;

        const movieDescription = document.createElement("p");
        movieDescription.textContent = movie.description;

        const movieLink = document.createElement("a");
        movieLink.href = movie.url;
        movieLink.textContent = "Ver ahora";

        const addToListBtn = document.createElement("button");
        addToListBtn.classList.add("add-to-list-btn");

        isInList(movie._id).then((exists) => {
            addToListBtn.textContent = exists ? "-" : "+";

            addToListBtn.addEventListener("click", async () => {
                if (exists) {
                    await removeFromList(movie._id);
                    addToListBtn.textContent = "+";
                    exists = false;
                } else {
                    await addToList(movie._id);
                    addToListBtn.textContent = "-";
                    exists = true;
                }
            });
        });

        movieDiv.appendChild(movieThumbnail);
        movieDiv.appendChild(movieTitle);
        movieDiv.appendChild(movieDescription);
        movieDiv.appendChild(movieLink);
        movieDiv.appendChild(addToListBtn);

        return movieDiv;
    }

    // Función para agregar la película a la lista
    async function addToList(movieId) {
        const pathSegments = window.location.pathname.split('/');
        const userId = pathSegments[2];
        const profileId = pathSegments[3];

        try {
            const response = await fetch(`/mi_lista/${userId}/${profileId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ movieId }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Error al agregar a la lista:", error);
            alert("Ocurrió un error al agregar la película.");
        }
    }

    // Función para verificar si la película está en la lista
    async function isInList(movieId) {
        const pathSegments = window.location.pathname.split('/');
        const userId = pathSegments[2];
        const profileId = pathSegments[3];

        try {
            const response = await fetch(`/mi_lista/${userId}/${profileId}/exists/${movieId}`);
            const data = await response.json();
            return data.exists;
        } catch (error) {
            console.error("Error al verificar si la película está en la lista:", error);
            return false;
        }
    }

    // Función para eliminar la película de la lista
    async function removeFromList(movieId) {
        const pathSegments = window.location.pathname.split('/');
        const userId = pathSegments[2];
        const profileId = pathSegments[3];

        console.log("Llamando a removeFromList con movieId:", movieId);

        try {
            const response = await fetch(`/mi_lista/${userId}/${profileId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ movieId }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Error al eliminar de la lista:", error);
            alert("Ocurrió un error al eliminar la película.");
        }
    }

    // Evento para manejar la búsqueda
    searchQuery.addEventListener("input", function () {
        const query = searchQuery.value.trim();

        if (query) {
            fetchMovies(query);
        } else {
            fetchAllMovies();
        }
    });

    // Cargar todas las películas al inicio cuando la página se carga
    fetchAllMovies();
});
