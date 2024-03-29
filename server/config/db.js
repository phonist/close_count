const mongoose = require('mongoose');
// const config = require('config');
// const db = config.get('mongoURI');

const connectDB = async (uri) => {
	try {
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			// useCreateIndex: true,
			// useFindAndModify: false,
			useUnifiedTopology: true
		});

		// // Since mongoose's Promise is deprecated, we override it with Node's Promise
		mongoose.Promise = global.Promise;
		// const conn = await mongoose.createConnection(uri).asPromise();
		// conn.readyState === 1 ? console.log('MongoDB connected') : console.log('MongoDB not connected');
		console.log('MongoDB Connected...');
	} catch (err) {
		console.error(err.message);
		// Exit process with failure
		process.exit(1);
	}
};

module.exports = connectDB;
