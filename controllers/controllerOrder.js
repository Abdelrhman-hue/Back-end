const Order = require("../module/orderShcema");
const Product = require("../module/productShcema");

const createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Order items are required" });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const quantity = item.quantity || 1;

      orderItems.push({
        product: product._id,
        quantity,
        price: product.price,
      });

      totalPrice += product.price * quantity;
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalPrice,
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("user", "fristname lastname email")
      .populate("items.product", "title price description category");

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "title price description category")
      .sort({ _id: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
};
