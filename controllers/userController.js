import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';

// Retailer: Delete a product
export const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    // Find and delete the product by ID and retailer ID
    const product = await Product.findOneAndDelete({ _id: productId, retailer: req.user.id });

    if (!product) {
      return res.status(404).json({ status: false, message: 'Product not found or you do not have permission to delete it.' });
    }

    // Remove the product from all carts
    await Cart.updateMany(
      { "items.product": productId },
      { $pull: { items: { product: productId } } }
    );

    // Remove the product from all orders (if applicable)
    await Order.updateMany(
      { "items.product": productId },
      { $pull: { items: { product: productId } } }
    );

    res.json({ status: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error("Error in deleteProduct:", error.message);
    res.status(500).json({ status: false, message: 'Server error', error: error.message });
  }
};
