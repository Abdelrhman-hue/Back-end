const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  discountPercentage: { type: Number, required: false },
  rating: { type: Number, required: false },
  stock: { type: Number, required: false },
  tags: { type: [String], required: false },
  brand: { type: String, required: false },
  sku: { type: String, required: false },
  weight: { type: Number, required: false },
  dimensions: {
    width: { type: Number, required: false },
    height: { type: Number, required: false },
    depth: { type: Number, required: false },
  },
  warrantyInformation: { type: String, required: false },
  shippingInformation: { type: String, required: false },
  availabilityStatus: { type: String, required: false },
  reviews: [
    {
      rating: { type: Number, required: false },
      comment: { type: String, required: false },
      date: { type: Date, required: false },
      reviewerName: { type: String, required: false },
      reviewerEmail: { type: String, required: false },
    },
  ],
  returnPolicy: { type: String, required: false },
  minimumOrderQuantity: { type: Number, required: false },
  meta: {
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false },
    barcode: { type: String, required: false },
    qrCode: { type: String, required: false },
  },
  images: { type: [String], required: false },
  thumbnail: { type: String, required: false },
});

module.exports = mongoose.model("Product list", productSchema);
