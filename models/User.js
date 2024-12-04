const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nombre del perfil
  avatar: { type: String, default: "default_avatar.png" }, // Avatar del perfil
  history: [
    {
      movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
      lastWatched: { type: Date },
    },
  ],
  my_list: [
    {
      movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    },
  ],
});

// Agregar un valor por defecto para 'my_list' para evitar el error de undefined
profileSchema.pre('save', function (next) {
  if (!this.my_list) {
    this.my_list = []; // Asegura que 'my_list' sea siempre un arreglo vacío si no tiene valor
  }
  next();
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
