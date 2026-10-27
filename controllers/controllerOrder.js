const Order = require("../module/orderShcema");
const Product = require("../module/productShcema");
const Cart = require("../module/cartShcema");

const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        error: "Cart is empty",
      });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of cart.items) {
      orderItems.push({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      });

      totalPrice += item.product.price * item.quantity;
    }

    const { shippingAddress, paymentMethod } = req.body;
    const order = await Order.create({
      shippingAddress: shippingAddress || {},
      user: req.user.id,
      items: orderItems,
      totalPrice,
      paymentMethod: paymentMethod || "stripe",
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "fristname lastname email")
      .populate("items.product", "title price description category image");

    res.status(201).json({
      status: "success",
      data: populatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate("items.product", "title price image category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

const allOrders = async (req, res) => {
  const orders = await Order.find();
  return res.status(200).json({
    status: "success",
    data: orders,
  });
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, shippingAddress, paymentMethod, isPaid } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (shippingAddress) updateData.shippingAddress = shippingAddress;
    if (paymentMethod) updateData.paymentMethod = paymentMethod;
    if (typeof isPaid === "boolean") updateData.isPaid = isPaid;

    const order = await Order.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json({ status: "success", data: order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  updateOrder,
  createOrder,
  getMyOrders,
  allOrders,
};
