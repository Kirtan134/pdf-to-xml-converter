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

const ConversionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  originalFileName: { type: String, required: true },
  status: { type: String, default: 'pending' },
  pdfUrl: { type: String, required: true },
  xmlUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create models
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Conversion = mongoose.models.Conversion || mongoose.model('Conversion', ConversionSchema);

// Database connection
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    if (mongoose.connection.readyState === 1) {
      console.log('Already connected to MongoDB');
      return;
    }
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds
    });
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    // Don't exit process on connection error in production
    if (process.env.NODE_ENV === 'development') {
      process.exit(1);
    }
    return error;
  }
};

// Don't auto-connect on import in production
if (process.env.NODE_ENV !== 'production') {
  connectDB();
}

// Legacy compatibility - Stub Prisma client for backward compatibility
export const prisma = {
  user: {
    findUnique: async ({ where }) => {
      await connectDB();
      return User.findOne(where);
    },
    findMany: async () => {
      await connectDB();
      return User.find({});
    },
    create: async ({ data }) => {
      await connectDB();
      const user = await User.create({
        name: data.name,
        email: data.email,
        passwordHash: data.password
      });
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      };
    }
  },
  conversion: {
    findUnique: async ({ where }) => {
      await connectDB();
      return Conversion.findOne(where);
    },
    findMany: async ({ where }) => {
      await connectDB();
      return Conversion.find(where || {});
    },
    create: async ({ data }) => {
      await connectDB();
      const conversion = await Conversion.create(data);
      return {
        id: conversion._id.toString(),
        userId: conversion.userId,
        originalFileName: conversion.originalFileName,
        status: conversion.status,
        pdfUrl: conversion.pdfUrl,
        xmlUrl: conversion.xmlUrl,
        createdAt: conversion.createdAt
      };
    },
    update: async ({ where, data }) => {
      await connectDB();
      const conversion = await Conversion.findOneAndUpdate(where, data, { new: true });
      return {
        id: conversion._id.toString(),
        userId: conversion.userId,
        originalFileName: conversion.originalFileName,
        status: conversion.status,
        pdfUrl: conversion.pdfUrl,
        xmlUrl: conversion.xmlUrl,
        createdAt: conversion.createdAt
      };
    }
  },
  $queryRaw: async () => {
    await connectDB();
    return [{ status: 'connected' }];
  }
};

// Legacy compatibility
export const safeClient = prisma;

export { connectDB };
