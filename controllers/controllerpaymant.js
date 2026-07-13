const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const Orders = require("../models/Order");

const createCheckoutSession = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Orders.findById(orderId).populate("items.product");

    if (!order) {
      return res.status(404).json({
        status: "fail",
        message: "Order not found",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: order.items.map((item) => ({
        price_data: {
          currency: "usd",

          product_data: {
            name: item.product.title,
          },

          unit_amount: item.price * 100,
        },

        quantity: item.quantity,
      })),

      mode: "payment",

      success_url: "http://localhost:3000/payment/success",

      cancel_url: "http://localhost:3000/payment/cancel",
    });

    order.stripeSessionId = session.id;

    await order.save();

    res.status(200).json({
      status: "success",
      url: session.url,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const webhook = async (req, res) => {
  const event = req.body;

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const order = await Orders.findOne({
      stripeSessionId: session.id,
    });

    if (order) {
      order.paymentStatus = "paid";
      order.isPaid = true;
      order.paidAt = new Date();

      await order.save();
    }
  }

  res.status(200).json({
    received: true,
  });
};

const verifyPayment = async (req, res) => {
  const { id } = req.params;

  const order = await Orders.findById(id);

  if (!order) {
    return res.status(404).json({
      status: "fail",
    });
  }

  res.status(200).json({
    status: "success",
    paymentStatus: order.paymentStatus,
    isPaid: order.isPaid,
  });
};

module.exports = {
  createCheckoutSession,
  webhook,
  verifyPayment,
};
