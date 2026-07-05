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
        ref: "Product",
      },

      quantity: Number,

      price: Number,
    },
  ],

  totalPrice: Number,

  status: {
    type: String,
    default: "Pending",
  },
});

module.exports = mongoose.model("Order", OrderSchema);
