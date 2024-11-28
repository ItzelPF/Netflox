const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  genres: { type: [String], required: true },
  duration: { type: Number }, // Duración en minutos (solo para películas)
  rating: { type: Number, min: 0, max: 10 },
  language: { type: String, default: "en" },
  thumbnail: String, // URL de la miniatura
  url: { type: String, required: true }, // URL para ver la película o serie
});

module.exports = mongoose.model("Movie", movieSchema);
