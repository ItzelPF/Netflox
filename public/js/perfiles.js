// Función para obtener perfiles de un usuario desde el backend
async function fetchProfiles(userId) {
  try {
    console.log(`Fetching profiles for userId: ${userId}`); // Depuración
    const response = await fetch(`/api/user/${userId}/profiles`);
    if (!response.ok) throw new Error(`Failed to fetch profiles: ${response.status}`);

    const profiles = await response.json();
    console.log('Profiles fetched:', profiles); // Depuración
    displayProfiles(profiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
  }
}

// Función para mostrar los perfiles en la página
function displayProfiles(profiles) {
  const profilesContainer = document.querySelector(".profiles");
  if (!profilesContainer) {
    console.error("No se encontró el contenedor .profiles en el DOM.");
    return;
  }

  profilesContainer.innerHTML = ""; // Limpiar perfiles previos

  // Verificar si hay perfiles para mostrar
  if (profiles.length === 0) {
    profilesContainer.innerHTML = "<p>No se han encontrado perfiles.</p>";
  }

  // Renderizar cada perfil
  profiles.forEach((profile) => {
    const profileDiv = document.createElement("div");
    profileDiv.className = "profile";
    profileDiv.innerHTML = `
      <img src="${profile.avatar || 'default_avatar.png'}" alt="${profile.name}""/>
      <span>${profile.name}</span>
    `;
    profilesContainer.appendChild(profileDiv);
  });

  // Agregar el botón "Agregar Perfil"
  const addProfileDiv = document.createElement("div");
  addProfileDiv.className = "profile add-profile";
  addProfileDiv.onclick = redirigirA;
  addProfileDiv.innerHTML = `
    <div class="add-icon">+</div>
    <span>Agregar Perfil</span>
  `;
  profilesContainer.appendChild(addProfileDiv);
}

// Función para obtener el ID del usuario desde la URL
// Función para obtener el ID desde la URL
function getUserIdFromURL() {
  const path = window.location.pathname; // Obtiene el path de la URL
  const segments = path.split('/'); // Divide el path en segmentos
  return segments[segments.length - 1]; // Devuelve el último segmento (el ID del usuario)
}

// Función para redirigir a la página de agregar perfil
function redirigirA() {
  const userId = getUserIdFromURL();
  if (userId) {
    window.location.href = `/anadirPerfil/${userId}`;
  } else {
    console.error("No se pudo obtener el ID del usuario para redirigir.");
  }
}

// Iniciar la carga de perfiles
const userId = getUserIdFromURL();
if (userId) {
  fetchProfiles(userId);
} else {
  console.error("No se pudo obtener el ID del usuario desde la URL.");
}
