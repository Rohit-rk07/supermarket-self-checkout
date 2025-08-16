import Product from '../models/Product.js';

// Get product by barcode
export const getProductByBarcode = async (req, res, next) => {
  try {
    const { barcode } = req.params;
    
    const product = await Product.findOne({ barcode });
    
    if (!product) {
      return res.status(404).json({ 
        error: 'Product not found',
        details: `No product found with barcode: ${barcode}` 
      });
    }
    
    res.json({
      name: product.name,
      price: product.price,
      barcode: product.barcode
    });
  } catch (error) {
    next(error);
  }
};

// Create new product
export const createProduct = async (req, res, next) => {
  try {
    const { barcode, name, price } = req.body;
    
    const product = new Product({ barcode, name, price });
    await product.save();
    
    res.status(201).json({
      message: 'Product created successfully',
      product: {
        barcode: product.barcode,
        name: product.name,
        price: product.price
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all products
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    
    res.json({
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// Update product
export const updateProduct = async (req, res, next) => {
  try {
    const { barcode } = req.params;
    const updates = req.body;
    
    const product = await Product.findOneAndUpdate(
      { barcode },
      updates,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        details: `No product found with barcode: ${barcode}`
      });
    }
    
    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// Delete product
export const deleteProduct = async (req, res, next) => {
  try {
    const { barcode } = req.params;
    
    const product = await Product.findOneAndDelete({ barcode });
    
    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        details: `No product found with barcode: ${barcode}`
      });
    }
    
    res.json({
      message: 'Product deleted successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};
