import User  from '../models/User.js';
import Order from '../models/Order.js';

export const viewUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const viewRetailers = async (req, res) => {
  try {
    const retailers = await User.find({ role: 'retailer' });
    res.json(retailers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const searchReports = async (req, res) => {
  const { query } = req.query;
  try {
    const users = await User.find({ role: 'user', $or: [
      { name: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } }
    ]});
    const retailers = await User.find({ role: 'retailer', $or: [
      { name: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } }
    ]});
    const orders = await Order.find().populate('user').populate('items.product');
    res.json({ users, retailers, orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
