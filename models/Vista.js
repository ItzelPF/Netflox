const mongoose = require("mongoose");

const viewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
  progress: { type: Number, default: 0 }, // Porcentaje de progreso (0-100)
  lastWatched: { type: Date, default: Date.now }, // Fecha de la última visualización
  completed: { type: Boolean, default: false }, // Si el contenido fue terminado
});

module.exports = mongoose.model("Vista", viewSchema);
