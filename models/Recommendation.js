const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recommendedMovies: [
    {
      movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
      reason: { type: String }, // Ejemplo: "Based on your watch history"
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Recommendation", recommendationSchema);
