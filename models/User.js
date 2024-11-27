const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nombre del perfil
  avatar: { type: String, default: "default_avatar.png" }, // Avatar del perfil
  watched: [
    {
      movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
      progress: { type: Number, default: 0 }, // Progreso en porcentaje
      lastWatched: { type: Date },
    },
  ],
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Email único
  password: { type: String, required: true },
  subscriptionPlan: { type: String, default: "basic" },
  membershipStartDate: { type: Date, default: Date.now },
  membershipEndDate: { type: Date },
  profiles: [profileSchema], // Lista de perfiles asociados al usuario
});

module.exports = mongoose.model("User", userSchema);
