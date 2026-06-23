require("dotenv").config(".env");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const controllersProdect = require("./controllers/controllersProdect");
const controllersUser = require("./controllers/controllerUser");
const authMiddleware = require("./middleware/Auth");
const rolesAuth = require("./middleware/rolesAuth");
const roles = require("./utils/roles");

const url = process.env.DATABASE;

app.use(cors());
app.use(express.json());
// app.all("*", (req, res, next) => {
//   return res.status(404).send("Not Found");
// });

mongoose.connect(url).then(() => console.log("MongoDB connected"));

// Get all products
app.get("/products", controllersProdect.getallproducts);

// Get a single product
app.get("/products/:id", controllersProdect.getproductsingle);

// Add a new product
app.post(
  "/products/add",
  authMiddleware,
  rolesAuth(roles.ADMIN),
  controllersProdect.addproduct,
);

// update a product
app.patch(
  "/products/update/:id",
  authMiddleware,
  rolesAuth(roles.ADMIN),
  controllersProdect.updateproduct,
);

// delete a product
app.delete(
  "/products/delete/:id",
  authMiddleware,
  rolesAuth(roles.ADMIN),
  controllersProdect.deleteproduct,
);

// User routes
// Get all users
app.get("/users", controllersUser.getallusers);

// Login user
app.get("/users/login", controllersUser.login);
// Register user
app.post("/users/register", controllersUser.register);

// Reset password
app.post(
  "/users/reset-password",
  authMiddleware,
  controllersUser.resetPassword,
);

app.post(
  "/users/verify-reset-code",
  authMiddleware,
  controllersUser.verifyResetCode,
);
// Update user
app.patch(
  "/users/update/:id",
  authMiddleware,
  rolesAuth(roles.ADMIN),
  controllersUser.updateuser,
);
// Delete user
app.delete(
  "/users/delete/:id",
  authMiddleware,
  rolesAuth(roles.ADMIN),
  controllersUser.deleteuser,
);

app.listen(process.env.PORT || 5000, () => {
  console.log(`listen in port ${process.env.PORT || 5000}`);
});
