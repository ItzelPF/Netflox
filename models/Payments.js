const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true }, // Monto pagado
  paymentDate: { type: Date, default: Date.now }, // Fecha del pago
  subscriptionPlan: {
    type: String,
    enum: ["basic", "standard", "premium"],
    required: true,
  },
  transactionId: { type: String, unique: true }, // ID de la transacción (si es necesario)
  status: {
    type: String,
    enum: ["completed", "pending", "failed"],
    default: "completed",
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
