const Cart = require("../module/cartShcema");
const Product = require("../module/productShcema");

const addToCart = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    const foundProduct = await Product.findById(product);

    if (!foundProduct) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    let cart = await Cart.findOne({
      user: req.user.id,
    });

    // لو أول مرة يعمل Cart
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [
          {
            product,
            quantity,
          },
        ],
      });

      return res.status(201).json(cart);
    }

    // هل المنتج موجود بالفعل؟
    const existingProduct = cart.items.find(
      (item) => item.product.toString() === product
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.items.push({
        product,
        quantity,
      });
    }

    await cart.save();

    res.status(200).json({
      status: "success",
      data: cart,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};


const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.id,
    })
      .populate("items.product", "title price image category description");

    if (!cart) {
      return res.status(200).json({
        status: "success",
        data: {
          items: [],
          totalPrice: 0,
        },
      });
    }

    let totalPrice = 0;

    cart.items.forEach((item) => {
      totalPrice += item.product.price * item.quantity;
    });

    res.status(200).json({
      status: "success",
      data: {
        items: cart.items,
        totalPrice,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
};