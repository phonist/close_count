const requireEnv = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const env = {
  port: Number(process.env.PORT || 8001),
  mongoUri: requireEnv(process.env.MONGO_URI, 'MONGO_URI'),
  jwtSecret: process.env.JWT_SECRET || process.env.jwtSecret || 'change-me',
  jwtExpire: process.env.JWT_EXPIRE || '5 days',
  clientUrl: process.env.CLIENT_URL || process.env.CLIENT || 'http://localhost:3000',
  environment: process.env.ENVIRONMENT || process.env.NODE_ENV || 'development',
};

export default env;
