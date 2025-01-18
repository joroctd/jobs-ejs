import express from 'express';
import 'express-async-errors';
import connectDatabase from './db/connect';

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// secret word handling
let secretWord = 'syzygy';
app.get('/secretWord', (req, res) => {
	res.render('secretWord', { secretWord });
});
app.post('/secretWord', (req, res) => {
	secretWord = req.body.secretWord;
	res.redirect('/secretWord');
});

app.use((req, res) => {
	res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
	res.status(500).send(err.message);
	console.log(err);
});

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
