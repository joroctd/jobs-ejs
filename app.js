import express from 'express';
import 'express-async-errors';

import session from 'express-session';
import connectMongoSession from 'connect-mongodb-session';
import flash from 'connect-flash';
import storeLocals from './middleware/session/storeLocals.js';

import secretWordRouter from './routes/secretWord.js';

import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

import connectDatabase from './db/connect.js';

const app = express();

if (app.get('env') === 'development') {
	process.loadEnvFile('./.env');
}

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const MongoDBStore = connectMongoSession(session);
const store = new MongoDBStore({
	uri: process.env.MONGO_URI,
	collection: 'mySessions'
});
store.on('error', console.error);
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
	sessionParams.cookie.secure = true;
}

app.use(session(sessionParams));
app.use(flash(), storeLocals);

app.use('/secretWord', secretWordRouter);

app.use(notFound, errorHandler);

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
		console.log(error);
	}
};
start();
