const productSchema = require("../module/productShcema");

const getallproducts = async (req, res) => {
  const products = await productSchema.find({});
  if (!products) return res.status(404).send("No products found");
  res.status(200).json(products);
};

const getproductsingle = async (req, res) => {
  const id = +req.params.id;
  const product = await productSchema.findOne({ id: id });
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.status(200).json(product);
};

const addproduct = async (req, res) => {
  const newProduct = new productSchema(req.body);
  await newProduct.save();
  console.log(newProduct);
  res.status(201).json(newProduct);
};

const updateproduct = async (req, res) => {
  const id = +req.params.id;
  const product = await productSchema.findOne({ id: id });
  if (!product) return res.status(404).json({ error: "Product not found" });
  await productSchema.updateOne({ id: id }, { $set: { ...req.body } });
  res.status(200).json({ message: "Product updated successfully" });
};

const deleteproduct = async (req, res) => {
  const id = +req.params.id;
  const product = await productSchema.findOne({ id: id });
  if (!product) return res.status(404).json({ error: "Product not found" });
  await productSchema.deleteOne({ id: id });
  res.status(200).json({ message: "Product deleted successfully" });
};

module.exports = {
  getallproducts,
  getproductsingle,
  addproduct,
  updateproduct,
  deleteproduct,
};
