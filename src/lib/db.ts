import mongoose from 'mongoose';

// Connection URI for MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pdf-to-xml';

// Define schemas
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create models
export const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Database connection
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    if (mongoose.connection.readyState === 1) {
      console.log('Already connected to MongoDB');
      return;
    }
    
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

// Initialize connection
connectDB();

export { connectDB };
