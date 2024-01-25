import { Schema, model,models } from 'mongoose';

// Define a schema for email replies
const replySchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  senderEmail: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  recipients: {
    type: String,
    required: true,
  },

  timestamp: { type: Date, default: Date.now },
});

// Create a model for email replies using the schema
const Reply = models?.Reply || model('Reply', replySchema);

export default Reply;
