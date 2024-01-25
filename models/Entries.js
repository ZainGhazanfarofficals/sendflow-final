import mongoose from 'mongoose';


const EntrySchema = new mongoose.Schema({
  userId: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true, // Provide a default value that makes sense for email
      },
      appPassword: {
        type: String,
        required: true, // Provide a default value that makes sense for appPassword
      },
});

const Entry = mongoose.models.Entry || mongoose.model('Entry', EntrySchema);

export default  Entry;