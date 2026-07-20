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
  const id = +req.params.id;
  const product = await productSchema.findOne({ id: id });
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.status(200).json(product);
};

const addproduct = async (req, res) => {
  const newProduct = new productSchema(req.body);
  await newProduct.save();
  console.log(newProduct);
  res.status(201).json(newProduct);
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
  const id = +req.params.id;
  const product = await productSchema.findOne({ id: id });
  if (!product) return res.status(404).json({ error: "Product not found" });
  await productSchema.updateOne({ id: id }, { $set: { ...req.body } });
  res.status(200).json({ message: "Product updated successfully" });
};

const deleteproduct = async (req, res) => {
  const id = +req.params.id;
  const product = await productSchema.findOne({ id: id });
  if (!product) return res.status(404).json({ error: "Product not found" });
  await productSchema.deleteOne({ id: id });
  res.status(200).json({ message: "Product deleted successfully" });
};

module.exports = {
  getallproducts,
  getproductsingle,
  addproduct,
  updateproduct,
  deleteproduct,
  // getSearchProducts,
};
