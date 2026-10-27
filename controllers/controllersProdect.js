const productSchema = require("../module/productShcema");

const getallproducts = async (req, res) => {
  try {
    const {
      q,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      inStock,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // Search
    if (q) {
      filter.$or = [
        {
          title: {
            $regex: q,
            $options: "i",
          },
        },
        {
          description: {
            $regex: q,
            $options: "i",
          },
        },
        {
          category: {
            $regex: q,
            $options: "i",
          },
        },
        {
          brand: {
            $regex: q,
            $options: "i",
          },
        },
      ];
    }

    // Categories
    if (category) {
      filter.category = {
        $in: category.split(","),
      };
    }

    // Brands
    if (brand) {
      filter.brand = {
        $in: brand.split(","),
      };
    }

    // Price
    filter.price = {};

    if (minPrice) filter.price.$gte = Number(minPrice);

    if (maxPrice) filter.price.$lte = Number(maxPrice);

    if (Object.keys(filter.price).length === 0) {
      delete filter.price;
    }

    // Rating
    if (rating) {
      filter.rating = {
        $gte: Number(rating),
      };
    }

    // Stock
    if (inStock === "true") {
      filter.stock = {
        $gt: 0,
      };
    }

    const skip = (page - 1) * limit;

    const products = await productSchema
      .find(filter)
      .skip(skip)
      .limit(Number(limit));

    const count = await productSchema.countDocuments(filter);

    res.json({
      products,
      count,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
const getproductsingle = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const paramId = req.params.id;
    let product = null;
    if (mongoose.Types.ObjectId.isValid(paramId)) {
      product = await productSchema.findById(paramId);
    }
    if (!product && !isNaN(+paramId)) {
      product = await productSchema.findOne({ id: +paramId });
    }
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      discountPercentage,
      rating,
      stock,
      tags,
      sku,
      weight,
      dimensions,
      warrantyInformation,
      shippingInformation,
      availabilityStatus,
      reviews,
      returnPolicy,
      minimumOrderQuantity,
      meta,
      images,
      thumbnail,
    } = req.body;

    if (!title || !category || price == null) {
      return res.status(400).json({
        status: "fail",
        message: "Title, category and price are required",
      });
    }

    const product = await productSchema.create({
      title,
      description,
      category,
      price,
      discountPercentage,
      rating,
      stock,
      tags,
      sku,
      weight,
      dimensions,
      warrantyInformation,
      shippingInformation,
      availabilityStatus,
      reviews,
      returnPolicy,
      minimumOrderQuantity,
      meta,
      images,
      thumbnail,
    });

    res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
// const getSearchProducts = async (req, res) => {
//   try {
//     const { q } = req.query;
//     let filter = {};
//     if (q) {
//       filter = {
//         $or: [
//           {
//             title: {
//               $regex: q,
//               $options: "i",
//             },
//           },
//           {
//             description: {
//               $regex: q,
//               $options: "i",
//             },
//           },
//           {
//             category: {
//               $regex: q,
//               $options: "i",
//             },
//           },
//         ],
//       };
//     }
//     console.log(filter);
//     const products = await productSchema.find(filter);
//     const count = await productSchema.countDocuments(filter);
//     console.log(count, products);
//     res.status(200).json({
//       count,
//       products,
//     });
//   } catch (error) {
//     res.status(500).json({
//       error: error.message,
//     });
//   }
// };

const updateproduct = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const paramId = req.params.id;
    let product = null;
    if (mongoose.Types.ObjectId.isValid(paramId)) {
      product = await productSchema.findByIdAndUpdate(paramId, { $set: req.body }, { new: true });
    } else if (!isNaN(+paramId)) {
      product = await productSchema.findOneAndUpdate({ id: +paramId }, { $set: req.body }, { new: true });
    }
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const { id } = req.params;
    let product = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await productSchema.findByIdAndDelete(id);
    } else if (!isNaN(+id)) {
      product = await productSchema.findOneAndDelete({ id: +id });
    }
    if (!product) {
      return res.status(404).json({
        status: "fail",
        error: "Product not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
};

module.exports = {
  getallproducts,
  getproductsingle,
  addProduct,
  updateproduct,
  deleteProduct,
  // getSearchProducts,
};
