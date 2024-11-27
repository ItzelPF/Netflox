const express = require("express");
const mongoose = require("mongoose");


// Modelos
const Movie = require("./models/Movies");
const User = require("./models/User");
const Vista = require("./models/Vista");
const Recommendation = require("./models/Recommendation");
const Payments = require("./models/Payments");

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

app.get("/peliculas", (req, res) => {
  res.render("peliculas"); // Renderiza el archivo peliculas.ejs
});

app.get("/anadirPerfil/:userId", (req, res) => {
  const { userId } = req.params;
  res.render("anadirPerfil", { userId }); // Renderiza el archivo añadirperfiles.ejs
});

// Ruta POST para añadir un nuevo perfil
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
      watched: [],
    };

    // Añadir el perfil al usuario
    user.profiles.push(newProfile);

    // Guardar los cambios en la base de datos
    await user.save();

    // Responder al cliente
    res.send(`
      <h1>Perfil añadido exitosamente</h1>
      <p>Nombre: ${name}</p>
      <img src="${avatar}" alt="Avatar" />
      <a href="/anadirPerfil">Añadir otro perfil</a>
    `);
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
    res.render("perfiles"); // Renderiza el archivo perfiles.ejs
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

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
