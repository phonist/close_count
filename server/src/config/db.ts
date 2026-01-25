import mongoose from 'mongoose';
import logger from '../utils/logger';

const connectDB = async (uri: string) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);

    mongoose.Promise = global.Promise;
    logger.info('MongoDB Connected...');
  } catch (err) {
    const error = err as Error;
    logger.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
