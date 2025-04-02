import prisma from './prisma';

// Ensure compatibility with existing code
export { prisma };

// Legacy compatibility
export const safeClient = prisma;

// Maintain connectDB function for backward compatibility
export const connectDB = async () => {
  try {
    // This is a no-op with Prisma, as connections are managed automatically
    console.log('Prisma client is ready');
    return true;
  } catch (error) {
    console.error('Failed to initialize Prisma client:', error);
    if (process.env.NODE_ENV === 'development') {
      process.exit(1);
    }
    return error;
  }
};

// Export User and Conversion models for backward compatibility
export const User = {
  findOne: async (where) => {
    const user = await prisma.user.findUnique({
      where,
    });
    
    // Map password to passwordHash for compatibility with existing code
    if (user && user.password) {
      user.passwordHash = user.password;
    }
    
    return user;
  },
  create: async (userData) => {
    // Handle custom _id if provided
    if (userData._id) {
      userData.id = userData._id;
      delete userData._id;
    }
    
    // Map passwordHash to password
    if (userData.passwordHash) {
      userData.password = userData.passwordHash;
      delete userData.passwordHash;
    }
    
    const user = await prisma.user.create({
      data: userData,
    });
    return user;
  },
  find: async (where = {}) => {
    const users = await prisma.user.findMany({
      where,
    });
    return users;
  },
};

export const Conversion = {
  findOne: async (where) => {
    // Handle _id to id mapping
    if (where._id) {
      where.id = where._id;
      delete where._id;
    }
    
    const conversion = await prisma.conversion.findUnique({
      where,
    });
    return conversion;
  },
  create: async (conversionData) => {
    // Handle custom _id if provided
    if (conversionData._id) {
      conversionData.id = conversionData._id;
      delete conversionData._id;
    }
    
    const conversion = await prisma.conversion.create({
      data: conversionData,
    });
    return conversion;
  },
  findOneAndUpdate: async (where, data, options = {}) => {
    // Handle _id to id mapping
    if (where._id) {
      where.id = where._id;
      delete where._id;
    }
    
    // Set up retry logic
    let retries = 3;
    let conversion = null;
    
    while (retries > 0 && !conversion) {
      try {
        conversion = await prisma.conversion.update({
          where,
          data,
        });
        break;
      } catch (retryError) {
        console.error(`Update retry failed (${retries} attempts left):`, retryError);
        retries--;
        if (retries === 0) throw retryError;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
      }
    }
    
    return conversion;
  },
  find: async (where = {}) => {
    const conversions = await prisma.conversion.findMany({
      where,
    });
    return conversions;
  },
};

