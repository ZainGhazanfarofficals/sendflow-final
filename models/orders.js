import mongoose from "mongoose";

// Define the schema for orders
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to a User model (if you have one)
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentIntentId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  // You can add more fields as needed, such as product details, shipping information, etc.
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create an Order model using the orderSchema
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
