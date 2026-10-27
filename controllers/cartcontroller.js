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
      (item) => item.product.toString() === product,
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
    }).populate(
      "items.product",
      "title price thumbnail images category description",
    );

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

    cart.items = cart.items.filter((item) => item.product != null);
    cart.items.forEach((item) => {
      totalPrice += (item.product?.price || 0) * (item.quantity || 1);
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

const deleteCartItem = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        status: "fail",
        message: "Cart not found",
      });
    }

    await Cart.updateOne(
      { user: userId },
      {
        $pull: {
          items: {
            product: productId,
          },
        },
      },
    );

    const updatedCart = await Cart.findOne({ user: userId });

    if (updatedCart.items.length === 0) {
      await Cart.deleteOne({ user: userId });
    }

    return res.status(200).json({
      status: "success",
      message: "Product removed from cart successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const clearCart = async (userId) => {
  await Cart.findOneAndUpdate(
    { user: userId },
    {
      items: [],
      totalPrice: 0,
    },
    {
      new: true,
    },
  );
};

module.exports = {
  addToCart,
  getCart,
  clearCart,
  deleteCartItem,
};
