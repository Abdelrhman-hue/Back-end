const Order = require("../module/orderShcema");
const Product = require("../module/productShcema");
const Cart = require("../module/cartShcema");
const Users = require("../module/usersShcema");
const httpresponser = require("../utils/httpjsend");

const dashboardCount = async (req, res) => {
  try {
    const userscount = await Users.countDocuments();

    const productcount = await Product.countDocuments();

    const ordercount = await Order.countDocuments();

    const TopOrder = await Order.find()
      .populate("user", "fristname lastname")
      .populate("items.product", "title price thumbnail")
      .sort({ totalPrice: -1 })
      .limit(4);

    const lastorder = await Order.find()
      .populate("user", "fristname lastname")
      .populate("items.product", "title price thumbnail")
      .sort({ createdAt: -1 })
      .limit(6);

    const counttotalRevenue = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);

    const totalRevenue = counttotalRevenue[0]?.totalRevenue || 0;

    return res.status(200).json({
      status: httpresponser.SUCCESS,
      data: {
        Users: userscount,
        Products: productcount,
        Orders: ordercount,
        Toporder: TopOrder,
        Last: lastorder,
        Total: totalRevenue,
      },
    });
  } catch (error) {
    return res.status(404).json({ status: httpresponser.ERROR, error: error });
  }
};

module.exports = {
  dashboardCount,
};
