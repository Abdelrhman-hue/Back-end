const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product list",
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
        default: 1,
      },

      price: {
        type: Number,
        required: true,
      },
    },
  ],

  totalPrice: Number,

  status: {
    type: String,
    default: "Pending",
  },
});

module.exports = mongoose.model("Order", OrderSchema);
