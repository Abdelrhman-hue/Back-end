const express = require("express");
const app = express();
const mongoose = require("mongoose");
const productSchema = require("./module/productShcema");
const cors = require("cors");
const controllersProdect = require("./controllers/controllersProdect");

const url =
  "mongodb+srv://bsfwtabwhsybt_db_user:12345678AA@learnnodejs.1cmw2hz.mongodb.net/project_1?appName=LearnNodeJs";

mongoose.connect(url).then(() => console.log("MongoDB connected"));

// Get all products
app.get("/", controllersProdect.getallproducts);

// Get a single product
app.get("/:id", controllersProdect.getproductsingle);

// Add a new product
app.post("/add", controllersProdect.addproduct);

// update a product
app.put("/update/:id", controllersProdect.updateproduct);

// delete a product
app.delete("/delete/:id", controllersProdect.deleteproduct);

app.listen(process.env.PORT || 5000, () => {
  console.log(`listen in port ${process.env.PORT || 5000}`);
});
