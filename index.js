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
const cookieParser = require("cookie-parser");
const getme = require("./middleware/getMe");
const controllerOrder = require("./controllers/controllerOrder");
const paymentController = require("./controllers/controllerpaymant");
const cartController = require("./controllers/cartcontroller");
const dashboardCount = require("./controllers/DashboardController");

const url = process.env.DATABASE;

app.use(
  cors({
    origin: ["http://localhost:3000", "https://shop-bog.vercel.app"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
// app.all("*", (req, res, next) => {
//   return res.status(404).send("Not Found");
// });

let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(url);
  isConnected = true;
  console.log("MongoDB connected");
}
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database connection failed" });
  }
});

mongoose.connect(url).then(() => console.log("MongoDB connected"));

// dashbord routs
app.get(
  "/dashboard",
  authMiddleware,
  rolesAuth(roles.ADMIN),
  dashboardCount.dashboardCount,
);

// Get all products
app.get("/products", controllersProdect.getallproducts);

// Get a single product
app.get("/products/:id", controllersProdect.getproductsingle);

// Add a new product
app.post(
  "/products/add",
  authMiddleware,
  rolesAuth(roles.ADMIN),
  controllersProdect.addProduct,
);

// search product
// app.get("/products/search",controllersProdect.getSearchProducts)

// update a product
app.put("/products/:id", authMiddleware, rolesAuth(roles.ADMIN), controllersProdect.updateproduct);
app.patch("/products/:id", authMiddleware, rolesAuth(roles.ADMIN), controllersProdect.updateproduct);
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
  controllersProdect.deleteProduct,
);

// User routes
// Get all users
app.get(
  "/users",
  authMiddleware,
  rolesAuth(roles.ADMIN),
  controllersUser.getallusers,
);

// Get a single user
app.get("/users/me", authMiddleware, getme, controllersUser.getuser);

// Logout user
app.post("/users/logout", controllersUser.logout);

// Login user
app.post("/users/login", controllersUser.login);
// Register user
app.post("/users/register", controllersUser.register);

// Reset password
app.post("/users/reset-password", controllersUser.resetPassword);

app.post("/users/verify-reset-code", controllersUser.verifyResetCode);
// Update user
app.patch("/users/update", authMiddleware, controllersUser.updateUser);
app.patch("/users/update/:id", authMiddleware, controllersUser.updateUser);
// Delete user
app.delete(
  "/users/delete/:id",
  authMiddleware,
  rolesAuth(roles.ADMIN),
  controllersUser.deleteuser,
);

// cart routes
app.post("/cart", authMiddleware, cartController.addToCart);
app.delete("/cart/:productId", authMiddleware, cartController.deleteCartItem);
app.get("/Mycart", authMiddleware, cartController.getCart);

// Order routes
app.post("/orders", authMiddleware, controllerOrder.createOrder);
app.get("/orders/me", authMiddleware, controllerOrder.getMyOrders);
app.get("/orders/all", authMiddleware, rolesAuth(roles.ADMIN),controllerOrder.allOrders);
app.patch("/orders/:id", authMiddleware, controllerOrder.updateOrder);

// Payment routes
app.post(
  "/payment/checkout",
  authMiddleware,
  paymentController.createCheckoutSession,
);
app.post("/payment/webhook", paymentController.webhook);
app.get("/payment/verify/:id", authMiddleware, paymentController.verifyPayment);

if (process.env.NODE_ENV !== "production") {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`listen in port ${process.env.PORT || 5000}`);
  });
}

module.exports = app;
