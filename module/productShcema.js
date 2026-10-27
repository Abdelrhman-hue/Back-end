const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    default: "",
  },
  id: {
    type: Number,
  },
  thumbnail: {
    type: String,
    default: "",
  },
  images: {
    type: [String],
    default: [],
  },
  discountPercentage: Number,
  rating: Number,
  stock: Number,
  tags: [String],
  sku: String,
  weight: Number,

  dimensions: {
    width: Number,
    height: Number,
    depth: Number,
  },

  warrantyInformation: String,
  shippingInformation: String,
  availabilityStatus: String,

  reviews: [
    {
      rating: Number,
      comment: String,
      date: Date,
      reviewerName: String,
      reviewerEmail: String,
    },
  ],

  returnPolicy: String,
  minimumOrderQuantity: Number,

  meta: {
    createdAt: Date,
    updatedAt: Date,
    barcode: String,
    qrCode: String,
  },
});

module.exports = mongoose.model("Product list", productSchema);
