import mongoose from 'mongoose';
import logger from '../utils/logger';
import env from './env';

const connectDB = async (uri: string) => {
  try {
    const options: mongoose.ConnectOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions;

    if (env.mongoCaFile) {
      options.tls = true;
      options.tlsCAFile = env.mongoCaFile;
    }

    await mongoose.connect(uri, options);

    mongoose.Promise = global.Promise;
    logger.info('MongoDB Connected...');
  } catch (err) {
    const error = err as Error;
    logger.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
