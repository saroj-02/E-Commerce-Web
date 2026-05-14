const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// Add to cart
router.post('/cart', verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.userId;

    let cartItem = await Cart.findOne({ user: userId, product: productId });
    
    if (cartItem) {
      cartItem.quantity += (quantity || 1);
      await cartItem.save();
    } else {
      cartItem = new Cart({ user: userId, product: productId, quantity: quantity || 1 });
      await cartItem.save();
    }
    res.json({ message: 'Cart updated', cartItem });
  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart' });
  }
});

// Update cart quantity
router.put('/cart/:id', verifyToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });
    
    const cartItem = await Cart.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { quantity },
      { new: true }
    );
    
    if (!cartItem) return res.status(404).json({ message: 'Item not found' });
    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ message: 'Error updating cart' });
  }
});

// Remove from cart
router.delete('/cart/:id', verifyToken, async (req, res) => {
  try {
    const cartItem = await Cart.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!cartItem) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing item' });
  }
});

// Get cart items
router.get('/cart', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const items = await Cart.find({ user: userId }).populate('product');
    
    // Filter out items where product no longer exists
    const validItems = items.filter(item => item.product);
    
    // Format to match expected frontend structure
    const formattedItems = validItems.map(item => ({
      id: item._id,
      product_id: item.product._id,
      quantity: item.quantity,
      name: item.product.name,
      price: item.product.price,
      image_url: item.product.image_url
    }));
    
    res.json(formattedItems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
});

// Place Order
router.post('/orders', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get cart items to save in order
    const cartItems = await Cart.find({ user: userId }).populate('product');
    if (cartItems.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    const items = cartItems
      .filter(item => item.product)
      .map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      }));

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = new Order({ user: userId, items, totalAmount });
    await order.save();
    
    // Clear cart after order
    await Cart.deleteMany({ user: userId });
    
    res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
  } catch (err) {
    res.status(500).json({ message: 'Error placing order' });
  }
});

// Get orders
router.get('/orders', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({ user: userId })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Toggle Wishlist
router.post('/wishlist/toggle', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;
    
    const user = await User.findById(userId);
    const index = user.wishlist.findIndex(id => id.toString() === productId);
    
    if (index > -1) {
      user.wishlist.splice(index, 1);
      await user.save();
      res.json({ message: 'Removed from wishlist', liked: false });
    } else {
      user.wishlist.push(productId);
      await user.save();
      res.json({ message: 'Added to wishlist', liked: true });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error toggling wishlist' });
  }
});

// Get Wishlist
router.get('/wishlist', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate('wishlist');
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
});

// Update Profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) return res.status(400).json({ message: 'Email already in use' });
      user.email = email;
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;

    await user.save();
    res.json({ message: 'Profile updated', user: { id: user._id, name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin, createdAt: user.createdAt } });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});


module.exports = router;
