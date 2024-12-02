const express = require("express");
const mongoose = require("mongoose");


// Modelos
const Movie = require("./models/Movies");
const User = require("./models/User");
const Vista = require("./models/Vista");
const Recommendation = require("./models/Recommendation");
const Payments = require("./models/Payments");
const Profile = require("./models/User");

// Configuración del servidor
const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true })); // Reemplaza body-parser
app.use(express.static("public")); // Archivos estáticos (CSS, JS)
app.set("view engine", "ejs");
app.set("views", __dirname + "/views"); // Asegúrate de que el directorio de vistas esté configurado correctamente

// Conexión a MongoDB
mongoose
  .connect("mongodb://localhost:27017/Netflox", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado a MongoDB"))
  .catch((error) => console.error("Error al conectar a MongoDB:", error));

// Esquema y modelo para ejemplo
const ItemSchema = new mongoose.Schema({
  name: String,
});
const Item = mongoose.model("Item", ItemSchema);



// Rutas a páginas
app.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.render("index", { items }); //principal
  } catch (error) {
    res.status(500).send("Error al obtener los datos");
  }
});

app.get("/index", (req, res) => {
  res.render("index"); // Renderiza el archivo index.ejs
});


app.get("/cuenta", (req, res) => {
  res.render("cuenta"); // Renderiza el archivo cuenta.ejs
});

app.get("/suscribir", (req, res) => {
    res.render("suscribir"); // Renderiza el archivo suscribir.ejs
});

app.get("/anadirPerfil/:userId", (req, res) => {
  const { userId } = req.params;
  res.render("anadirPerfil", { userId }); // Renderiza el archivo añadirperfiles.ejs
});

app.post('/anadirPerfil/:userId', async (req, res) => {
  const { userId } = req.params;
  const { name, avatar } = req.body; // userId debe ser proporcionado en el formulario o la sesión

  if (!userId) {
    return res.status(400).send('Error: Se necesita el ID del usuario');
  }

  try {
    // Encontrar al usuario por ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }

    // Crear el nuevo perfil
    const newProfile = {
      name,
      avatar: avatar || 'default_avatar.png', // Usa un avatar predeterminado si no se selecciona ninguno
      watched: [],  // Asumimos que 'watched' es un array que puede llenarse después
    };

    // Añadir el perfil al usuario
    user.profiles.push(newProfile);

    // Guardar los cambios en la base de datos
    await user.save();

    // Obtener el profileId del perfil recién creado
    const profileId = user.profiles[user.profiles.length - 1]._id;

    // Redirigir al cliente a la página de contenido
    res.redirect(`/contenido/${userId}/${profileId}`);

  } catch (error) {
    console.error('Error al añadir el perfil:', error);
    res.status(500).send('Error del servidor al añadir el perfil');
  }
});


app.get("/perfiles/:userId", async (req, res) => {
  const { userId } = req.params;

  // Verificar si el userId es un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    const user = await User.findById(userId).select("profiles");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Si el usuario tiene perfiles, devolverlos en formato JSON
    res.render("perfiles"); // Renderiza el archivo perfiles.ejs
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ message: "Error fetching profiles", error });
  }
});

// Rutas para validaciones
const bcrypt = require("bcrypt");

app.post("/registrar", async (req, res) => {
  const { name, email, password, confirmPassword, subscriptionPlan } = req.body;

  // Validaciones
  if (password !== confirmPassword) {
    return res.status(400).send("Las contraseñas no coinciden.");
  }

  try {
    // Generar hash para la contraseña
    const hashedPassword = await bcrypt.hash(password, 10); // 10 es el número de "salt rounds"

    // Crear nuevo usuario con la contraseña cifrada
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Guardar la contraseña cifrada
      subscriptionPlan,
    });

    // Guardar en la base de datos
    await newUser.save();
    res.render("cuenta"); // Renderiza el archivo cuenta.ejs
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).send("Hubo un error al registrar el usuario.");
  }
});
  
// Ruta de inicio de sesión
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

   try {
     // Buscar al usuario por email
     const user = await User.findOne({ email });
  
     if (!user) {
       return res.status(401).send("El usuario no existe.");
     }
  
    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);
  
     if (!passwordMatch) {
       return res.status(401).send("Credenciales incorrectas.");
     }
  
     // Usuario autenticado con éxito
     res.redirect(`/perfiles/${user._id}`);
  } catch (error) {
     console.error("Error al iniciar sesión:", error);
    res.status(500).send("Hubo un error al iniciar sesión.");
  }
});

// Obtener perfiles del usuario
app.get('/api/user/:userId/profiles', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Buscar el usuario por ID y cargar los perfiles
    const user = await User.findById(userId).select('profiles'); // Solo seleccionar el campo profiles
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user.profiles); // Retornar los perfiles del usuario
  } catch (error) {
    console.error('Error al obtener los perfiles:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.get("/contenido/:userId/:profileId", async (req, res) => {
  const { userId, profileId } = req.params;

  try {
    // Busca al usuario y extrae su perfil
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("Usuario no encontrado.");
    }

    // Busca el perfil dentro del usuario
    const profile = user.profiles.id(profileId);

    if (!profile) {
      return res.status(404).send("Perfil no encontrado.");
    }

    // Renderiza la vista con el avatar del perfil
    res.render("contenido", { userId, profileId, avatar: profile.avatar });
  } catch (error) {
    console.error("Error al buscar el perfil:", error);
    res.status(500).send("Error interno del servidor.");
  }
});

app.get('/generos/:userId/:profileId', async (req, res) => {
  const { userId, profileId } = req.params;

  try {
      // Verificar usuario y perfil (si usas esa lógica en tu sistema)
      const user = await User.findById(userId);
      if (!user) return res.status(404).send("Usuario no encontrado.");

      const profile = user.profiles.id(profileId);
      if (!profile) return res.status(404).send("Perfil no encontrado.");

      // Obtener las películas organizadas por género
      const movies = await Movie.aggregate([
          { $unwind: "$genres" }, // Desglosa cada género individualmente
          {
              $group: {
                  _id: "$genres", // Agrupa por género
                  movies: {
                      $push: {
                          title: "$title",
                          description: "$description",
                          releaseYear: "$releaseYear",
                          duration: "$duration",
                          thumbnail: "$thumbnail",
                          url: "$url"
                      }
                  }
              }
          },
          { $sort: { _id: 1 } } // Ordena alfabéticamente por género
      ]);

      // Renderizar la vista y pasar los datos
      res.render('generos', { userId, profileId, avatar: profile.avatar, movies });
  } catch (error) {
      console.error("Error al obtener las películas:", error);
      res.status(500).send("Error interno del servidor.");
  }
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



// Ruta para obtener las películas
app.get("/api/movies", async (req, res) => {
  try {
    const query = req.query.q; // Obtener el parámetro de búsqueda
    let filter = {}; // Objeto de filtro inicial

    // Si hay un término de búsqueda, filtramos las películas por título
    if (query) {
      filter = { title: { $regex: query, $options: 'i' } }; // Búsqueda insensible a mayúsculas y minúsculas
    }

    // Obtener las películas desde la base de datos
    const movies = await Movie.find(filter);
    res.json(movies); // Enviar las películas encontradas al frontend
  } catch (error) {
    res.status(500).send("Error al obtener las películas.");
  }
});

app.get('/api/movies/genre', async (req, res) => {
  const genre = req.query.q;
  try {
      const movies = await Movie.find({ genres: genre }); // Cambié "genre" por "genres"
      res.json(movies);
  } catch (error) {
      console.error("Error al obtener las películas por género:", error);
      res.status(500).json({ message: "Error al obtener las películas" });
  }
});

// Mi lista
app.use(express.json());  // Esto es necesario para acceder a req.body

app.post("/mi_lista/:userId/:profileId", async (req, res) => {
  const { userId, profileId } = req.params;
  const { movieId } = req.body;
  // Validar si userId y profileId son ObjectId válidos
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(profileId)) {
      return res.status(400).json({ message: "userId o profileId no son válidos" });
  }

  try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

      const profile = user.profiles.id(profileId);
      if (!profile) return res.status(404).json({ message: "Perfil no encontrado." });

      const movie = await Movie.findById(movieId);
      if (!movie) {
          return res.status(404).json({ message: `Película con ID ${movieId} no encontrada.` });
      }

      const alreadyExists = profile.my_list.some((item) => item.movieId.equals(movie._id));
      if (alreadyExists) {
          return res.status(400).json({ message: `La película "${movie.title}" ya está en la lista.` });
      }

      profile.my_list.push({ movieId: movie._id });
      await user.save();
      res.status(200).json({ message: "Película agregada de la lista." });
  } catch (error) {
      console.error("Error al agregar película:", error);
      res.status(500).json({ message: "Error del servidor." });
  }
});

app.get("/mi_lista/:userId/:profileId/exists/:movieId", async (req, res) => {
  const { userId, profileId, movieId } = req.params;

  try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ exists: false });

      const profile = user.profiles.id(profileId);
      if (!profile) return res.status(404).json({ exists: false });

      const exists = profile.my_list.some((item) => item.movieId.equals(movieId));
      res.json({ exists });
  } catch (error) {
      console.error("Error al verificar si la película está en la lista:", error);
      res.status(500).json({ exists: false });
  }
});

app.delete("/mi_lista/:userId/:profileId", async (req, res) => {
  const { userId, profileId } = req.params;
  const { movieId } = req.body;

  try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

      const profile = user.profiles.id(profileId);
      if (!profile) return res.status(404).json({ message: "Perfil no encontrado." });

      // Eliminar la película de la lista
      profile.my_list = profile.my_list.filter((item) => !item.movieId.equals(movieId));
      await user.save();

      res.status(200).json({ message: "Película eliminada de la lista." });
  } catch (error) {
      console.error("Error al eliminar película:", error);
      res.status(500).json({ message: "Error del servidor." });
  }
});



app.get("/mi_lista/:userId/:profileId", async (req, res) => {
  const { userId, profileId } = req.params;

  try {
    // Buscar al usuario y su perfil
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const profile = user.profiles.id(profileId);
    if (!profile) {
      return res.status(404).json({ message: "Perfil no encontrado." });
    }

    // Obtener las películas de la lista de ese perfil usando los movieId
    const movieIds = profile.my_list.map(item => item.movieId);
    const movies = await Movie.find({ _id: { $in: movieIds } });

    // Renderizar la vista y pasar las películas a mostrar
    res.render('my_list', { userId, profileId, avatar: profile.avatar, movies });
  } catch (error) {
    console.error("Error al obtener la lista:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
});

