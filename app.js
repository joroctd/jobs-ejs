import express from 'express';
import 'express-async-errors';
import rateLimiter from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import xss from './middleware/xss.js';

import session from 'express-session';
import connectMongoSession from 'connect-mongodb-session';
import passport from 'passport';
import passportSetup from './security/passportSetup.js';
import flash from 'connect-flash';
import setLocals from './middleware/session/storeLocals.js';

import wordRouter from './routes/secretWord.js';
import sessionsRouter from './routes/sessions.js';
import jobsRouter from './routes/jobs.js';

import authMiddleware from './middleware/session/auth.js';
import notFound from './middleware/notFound.js';
import errorHandlerMiddleware from './middleware/errorHandler.js';

import connectDatabase from './db/connect.js';

const app = express();

app.set('view engine', 'ejs');
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100 // max requests, per IP, per amount of time above
	}),
	express.urlencoded({ extended: true }),
	helmet(),
	hpp(),
	xss()
);

if (app.get('env') === 'development') {
	process.loadEnvFile('./.env');
}

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
		sameSite: true
	}
};

if (app.get('env') === 'production') {
	app.set('trust proxy', 1);
	sessionParams.cookie.secure = true;
}

app.use(session(sessionParams));
passportSetup();
app.use(passport.initialize());
app.use(passport.session());
app.use(flash(), setLocals);

app.get('/', (req, res) => {
	res.render('index');
});
app.use('/secretWord', authMiddleware, wordRouter);
app.use('/sessions', sessionsRouter);
app.use('/jobs', authMiddleware, jobsRouter);

app.use(notFound, errorHandlerMiddleware);

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
