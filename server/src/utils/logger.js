// Simple logger utility
// Can be enhanced with winston or pino in the future

const isDevelopment = process.env.ENVIRONMENT === 'development' || process.env.NODE_ENV === 'development';

const logger = {
  info: (message, ...args) => {
    if (isDevelopment) {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
  
  error: (message, ...args) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...args);
  },
  
  warn: (message, ...args) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
  },
  
  debug: (message, ...args) => {
    if (isDevelopment) {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
    }
  }
};

module.exports = logger;
