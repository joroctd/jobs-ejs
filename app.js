import express from 'express';
import 'express-async-errors';
import session from 'express-session';
import connectMongoSession from 'connect-mongodb-session';
import flash from 'connect-flash';
import setFlashLocals from './middleware/flashLocals.js';
import wordRouter from './routes/secretWord.js';
import notFound from './middleware/notFound.js';
import errorHandlerMiddleware from './middleware/errorHandler.js';
import connectDatabase from './db/connect.js';

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

if (app.get('env') === 'development') {
	process.loadEnvFile('./.env');
}

const MongoDBStore = connectMongoSession(session);
const store = new MongoDBStore({
	uri: process.env.MONGO_URI,
	collection: 'mySessions'
});
store.on('error', error => {
	console.error(error);
});
const sessionParams = {
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
	store,
	cookie: {
		secure: false,
		sameSite: 'strict'
	}
};

if (app.get('env') === 'production') {
	app.set('trust proxy', 1);
	sessionParams.cookie.secure = true;
}

app.use(session(sessionParams));
app.use(flash(), setFlashLocals);

app.use('/secretWord', wordRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const start = async () => {
	try {
		await connectDatabase(process.env.MONGO_URI);
		app.listen(port, err => {
			if (err) {
				console.error(`Could not start server on port ${port}.`);
				throw err;
			}
			console.log(`Server listening on port ${port}.`);
			console.log(`Access at: http://localhost:${port}`);
		});
	} catch (error) {
		console.error(error);
	}
};
start();
