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

            // Si no hay resultados
            if (movies.length === 0) {
                moviesCont.innerHTML = "<p>No se encontraron películas.</p>";
                return;
            }

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

        // Crear el botón de agregar a la lista
        const addToListBtn = document.createElement("button");
        addToListBtn.classList.add("add-to-list-btn");
        addToListBtn.textContent = "+";

        addToListBtn.addEventListener("click", () => {
            if (movie._id) {
                console.log("Enviando movieId:", movie._id);  // Verifica que el movieId esté correctamente
                addToList(movie._id);
            } else {
                console.error("Error: movie._id no está definido.");
                alert("No se pudo agregar la película, el ID es inválido.");
            }
        });

        // Añadir los elementos al contenedor de la película
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
    
        console.log("Cuerpo de la solicitud:", { movieId }); // Verifica el cuerpo antes de enviarlo
    
        try {
            const response = await fetch(`/mi_lista/${userId}/${profileId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ movieId }), // Asegúrate de que esto esté correcto
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
