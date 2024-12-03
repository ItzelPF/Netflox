document.addEventListener("DOMContentLoaded", function () {
    const moviesCont = document.getElementById("movies-cont");
    const searchQuery = document.getElementById("search-query");
    const buttons = document.querySelectorAll(".remove-from-list-btn");
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

    buttons.forEach(button => {
        button.addEventListener("click", async (event) => {
            const movieId = event.target.getAttribute("data-movie-id");
            const movieElement = event.target.closest(".movie");

            console.log("Llamando a removeFromList con movieId:", movieId);

            try {
                // URL generada dinámicamente
                const pathSegments = window.location.pathname.split('/');
                const userId = pathSegments[2];
                const profileId = pathSegments[3];

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

                    // Elimina el elemento del DOM
                    movieElement.remove();
                } else {
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                console.error("Error al eliminar de la lista:", error);
                alert("Ocurrió un error al eliminar la película.");
            }
        });
    });
});
