// Seleccionamos todos los botones para eliminar películas
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".remove-from-list-btn");

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