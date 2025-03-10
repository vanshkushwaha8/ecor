import Cart from'../models/Cart.js';
import Order from'../models/Order.js';
import Product from '../models/Product.js';
import validateOrder from '../validation/validateOrder.js';

export const checkout = async (req, res) => {
  const { error } = validateOrder(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }
  try {
      const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
      console.log('Cart:', cart);
      
      if (!cart || cart.items.length === 0) {
          return res.status(400).json({ message: 'Cart is empty' });
      }
      
      let totalPrice = 0;
      // Check stock availability and calculate total price
      for (let item of cart.items) {
          console.log(`Product: ${item.product.name}, Stock: ${item.product.stock}, Quantity: ${item.quantity}`);
          if (item.product.stock < item.quantity) {
              return res.status(400).json({ message: `Insufficient stock for ${item.product.name}` });
          }
          totalPrice += item.product.price * item.quantity;
      }
      
      // Create a new order
      const order = new Order({
          user: req.user.id,
          items: cart.items.map(item => ({ product: item.product._id, quantity: item.quantity })),
          totalPrice,
          status: 'completed'
      });
      await order.save().then(() => {
          console.log('Order saved successfully');
      }).catch(error => {
          console.error('Error saving order:', error);
      });
      
      
     return res.status(201).json({ success:true, message: 'Order placed successfully', order });
  } catch (error) {
     return res.status(500).json({ success:false, message: 'Server error' });
  }
};

//get all oder 
export const getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find().populate('user').populate('items.product');
      return res.json(orders);
    } catch (error) {
       return res.status(500).json({ success:false,message: 'Server error' });
    }
  };

  //get all get user orders
  export const getUserOrders = async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user.id }).populate('items.product');
      return res.json(orders);
    } catch (error) {
      return res.status(500).json({ success:false, message: 'Server error' });
    }
  };
    