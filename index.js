const express = require("express");
const app = express();
const mongoose = require("mongoose");
const productSchema = require("./module/productShcema");
const cors = require("cors");
const controllersProdect = require("./controllers/controllersProdect");
const controllersUser = require("./controllers/controllerUser");

const url =
  "mongodb+srv://bsfwtabwhsybt_db_user:12345678AA@learnnodejs.1cmw2hz.mongodb.net/project_1?appName=LearnNodeJs";

app.use(cors());
app.use(express.json());

mongoose.connect(url).then(() => console.log("MongoDB connected"));

// Get all products
app.get("/products", controllersProdect.getallproducts);

// Get a single product
app.get("/products/:id", controllersProdect.getproductsingle);

// Add a new product
app.post("/products/add", controllersProdect.addproduct);

// update a product
app.patch("/products/update/:id", controllersProdect.updateproduct);

// delete a product
app.delete("/products/delete/:id", controllersProdect.deleteproduct);

app.get("/users", controllersUser.getallusers);

app.get("/users/:id", controllersUser.getusersingle);

app.post("/users/add", controllersUser.adduser);

app.patch("/users/update/:id", controllersUser.updateuser);

app.delete("/users/delete/:id", controllersUser.deleteuser);

app.listen(process.env.PORT || 5000, () => {
  console.log(`listen in port ${process.env.PORT || 5000}`);
});

