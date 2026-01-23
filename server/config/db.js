const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async (uri) => {
	try {
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});

		mongoose.Promise = global.Promise;
		logger.info('MongoDB Connected...');
	} catch (err) {
		logger.error('MongoDB connection error:', err.message);
		// Exit process with failure
		process.exit(1);
	}
};

module.exports = connectDB;
