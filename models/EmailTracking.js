import mongoose from 'mongoose';

const emailTrackingSchema = new mongoose.Schema({
  campid: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: String,
    required: true,
  },
  opens: {
    type: Number,
    default: 0,
  },
  sent: {
    type: Number,
    default: 0, 
  },
  replies: {
    type: Number,
    default: 0, 
  },
});

const EmailTracking = mongoose.models.EmailTracking || mongoose.model('EmailTracking', emailTrackingSchema);

export default EmailTracking
