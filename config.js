// If an environment variable NODE_ENV is not equal to PROD
// We need to load local env file for running the app locally
if (process.env.NODE_ENV !== 'PROD') {
	process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/picsilyDB';
	process.env.ALLOW_ORIGIN = 'http://localhost:2000';
	process.env.PORT = 2001;
}

module.exports = {
	secretKey: '12345-67890-09876-54321',
	mongoUrl: process.env['MONGODB_URI'], //'mongodb://localhost:27017/picsilyDB'
};
